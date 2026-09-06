// Standalone offline verifier for RECEIPTS.md. No HAIDAA code or network calls.
package main

import (
	"bufio"
	"bytes"
	"crypto/ed25519"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"
	"unicode/utf8"

	"filippo.io/edwards25519"
)

const domain = "DSM-PILOT-ADMISSION-V0\n"

var zero = "sha256:" + strings.Repeat("0", 64)
var hashRE = regexp.MustCompile(`^sha256:[0-9a-f]{64}$`)
var seqRE = regexp.MustCompile(`^[1-9][0-9]{0,15}$`)
var uuidRE = regexp.MustCompile(`^(?:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$`)
var b64RE = regexp.MustCompile(`^[A-Za-z0-9_-]+$`)

func unb64(s string, n int) ([]byte, error) {
	b, e := base64.RawURLEncoding.Strict().DecodeString(s)
	if e != nil || !b64RE.MatchString(s) || len(b) != n {
		return nil, errors.New("invalid_encoding")
	}
	return b, nil
}

// encoding/json repairs lone surrogate escapes; reject them before decoding.
func unicodeEscapes(raw []byte) bool {
	in := false
	for i := 0; i < len(raw); i++ {
		if raw[i] == '"' {
			in = !in
			continue
		}
		if !in || raw[i] != '\\' {
			continue
		}
		i++
		if i >= len(raw) {
			return false
		}
		if raw[i] != 'u' {
			continue
		}
		if i+4 >= len(raw) {
			return false
		}
		n, e := strconv.ParseUint(string(raw[i+1:i+5]), 16, 16)
		if e != nil {
			return false
		}
		i += 4
		if n >= 0xdc00 && n <= 0xdfff {
			return false
		}
		if n >= 0xd800 && n <= 0xdbff {
			if i+6 >= len(raw) || raw[i+1] != '\\' || raw[i+2] != 'u' {
				return false
			}
			low, e := strconv.ParseUint(string(raw[i+3:i+7]), 16, 16)
			if e != nil || low < 0xdc00 || low > 0xdfff {
				return false
			}
			i += 6
		}
	}
	return true
}
func strict(raw []byte) (map[string]any, string) {
	if len(raw) > 8192 {
		return nil, "receipt_too_large"
	}
	if !utf8.Valid(raw) {
		return nil, "invalid_utf8"
	}
	if !unicodeEscapes(raw) {
		return nil, "invalid_json"
	}
	d := json.NewDecoder(bytes.NewReader(raw))
	d.UseNumber()
	var walk func(int) error
	walk = func(depth int) error {
		if depth > 16 {
			return errors.New("depth")
		}
		t, e := d.Token()
		if e != nil {
			return e
		}
		switch v := t.(type) {
		case json.Delim:
			if v == '{' {
				seen := map[string]bool{}
				for d.More() {
					k, e := d.Token()
					if e != nil {
						return e
					}
					s, ok := k.(string)
					if !ok || seen[s] || len(seen) >= 256 {
						return errors.New("duplicate")
					}
					seen[s] = true
					if e = walk(depth + 1); e != nil {
						return e
					}
				}
			} else if v == '[' {
				count := 0
				for d.More() {
					count++
					if count > 64 {
						return errors.New("array")
					}
					if e = walk(depth + 1); e != nil {
						return e
					}
				}
			} else {
				return errors.New("delimiter")
			}
			_, e = d.Token()
			return e
		case json.Number:
			s := string(v)
			n, e := strconv.ParseInt(s, 10, 64)
			if e != nil || strings.ContainsAny(s, ".eE") || s == "-0" || n > 9007199254740991 || n < -9007199254740991 {
				return errors.New("number")
			}
		}
		return nil
	}
	if e := walk(0); e != nil {
		return nil, "invalid_json"
	}
	if _, e := d.Token(); e != io.EOF {
		return nil, "invalid_json"
	}
	var m map[string]any
	d = json.NewDecoder(bytes.NewReader(raw))
	d.UseNumber()
	if d.Decode(&m) != nil {
		return nil, "receipt_schema"
	}
	return m, ""
}
func str(m map[string]any, k string) string { s, _ := m[k].(string); return s }
func exact(m map[string]any, keys string) bool {
	ks := strings.Fields(keys)
	if len(m) != len(ks) {
		return false
	}
	for _, k := range ks {
		if _, ok := m[k]; !ok {
			return false
		}
	}
	return true
}
func canonical(body map[string]any) ([]byte, bool) {
	if !exact(body, "protocol version namespace_id sequence event_id previous_receipt_hash accepted_at server_key_id profile verification_state principal_attribution") {
		return nil, false
	}
	for _, kv := range [][2]string{{"protocol", "dsm-pilot-admission"}, {"profile", "dsm-pilot-v0"}, {"verification_state", "unverified"}, {"principal_attribution", "unresolved"}} {
		if str(body, kv[0]) != kv[1] {
			return nil, false
		}
	}
	if body["version"] != json.Number("0") || !uuidRE.MatchString(str(body, "namespace_id")) {
		return nil, false
	}
	seq := str(body, "sequence")
	n, e := strconv.ParseUint(seq, 10, 64)
	if !seqRE.MatchString(seq) || e != nil || n > 9007199254740991 {
		return nil, false
	}
	if !hashRE.MatchString(str(body, "event_id")) || !hashRE.MatchString(str(body, "previous_receipt_hash")) {
		return nil, false
	}
	ts := str(body, "accepted_at")
	t, e := time.Parse("2006-01-02T15:04:05.000Z", ts)
	if e != nil || t.Format("2006-01-02T15:04:05.000Z") != ts {
		return nil, false
	}
	key := str(body, "server_key_id")
	if len(key) != 51 || !strings.HasPrefix(key, "ed25519:") || !b64RE.MatchString(key[8:]) {
		return nil, false
	}
	// Every accepted field name and string value is ASCII and has no JSON-escaped
	// characters. Sorted encoding/json output is exactly RFC 8785 on this closed
	// schema. This is not a generic JCS serializer for arbitrary JSON.
	b, e := json.Marshal(body)
	return b, e == nil
}
func primePoint(raw []byte) bool {
	p, e := new(edwards25519.Point).SetBytes(raw)
	if e != nil || !bytes.Equal(p.Bytes(), raw) || p.Equal(edwards25519.NewIdentityPoint()) == 1 {
		return false
	}
	eightBytes := make([]byte, 32)
	eightBytes[0] = 8
	eight, _ := new(edwards25519.Scalar).SetCanonicalBytes(eightBytes)
	inverse := new(edwards25519.Scalar).Invert(eight)
	cleared := new(edwards25519.Point).MultByCofactor(p)
	return new(edwards25519.Point).ScalarMult(inverse, cleared).Equal(p) == 1
}

type Context struct {
	Key       string
	Namespace string
	Sequence  uint64
	Hash      string
}
type Result struct {
	Canonicalization   string   `json:"canonicalization_check"`
	Hash               string   `json:"receipt_hash_check"`
	Signature          string   `json:"server_signature_check"`
	Bootstrap          string   `json:"bootstrap_key_check"`
	Namespace          string   `json:"namespace_check"`
	Sequence           string   `json:"sequence_check"`
	Chain              string   `json:"chain_link_check"`
	Protocol           string   `json:"protocol_verification"`
	Failures           []string `json:"failures"`
	Recomputed         string   `json:"recomputed_receipt_hash,omitempty"`
	CanonicalHex       string   `json:"canonical_hex,omitempty"`
	PreimageHex        string   `json:"preimage_hex,omitempty"`
	GeneratedSignature string   `json:"generated_signature,omitempty"`
}

func check(raw []byte, c Context, seed []byte) (r Result, next Context) {
	r = Result{Canonicalization: "not_checked", Hash: "not_checked", Signature: "not_checked", Bootstrap: "not_checked", Namespace: "not_checked", Sequence: "not_checked", Chain: "not_checked", Protocol: "fail", Failures: []string{}}
	next = c
	fail := func(s string) (Result, Context) { r.Failures = append(r.Failures, s); return r, next }
	m, err := strict(raw)
	if err != "" {
		return fail(err)
	}
	body, ok := m["body"].(map[string]any)
	if !ok || !exact(m, "body canonical_body_base64url receipt_hash signature") {
		return fail("receipt_schema")
	}
	b, ok := canonical(body)
	if !ok || !hashRE.MatchString(str(m, "receipt_hash")) {
		return fail("receipt_schema")
	}
	sig, e := unb64(str(m, "signature"), 64)
	if e != nil {
		return fail("invalid_encoding")
	}
	key, e := unb64(str(body, "server_key_id")[8:], 32)
	if e != nil {
		return fail("invalid_encoding")
	}
	enc := str(m, "canonical_body_base64url")
	if len(enc) == 0 || len(enc) > 5462 {
		return fail("receipt_schema")
	}
	retained, e := base64.RawURLEncoding.Strict().DecodeString(enc)
	if len(retained) > 4096 {
		return fail("receipt_too_large")
	}
	if e != nil || !b64RE.MatchString(enc) {
		return fail("invalid_encoding")
	}
	test := func(target *string, ok bool, reason string) {
		*target = "pass"
		if !ok {
			*target = "fail"
			r.Failures = append(r.Failures, reason)
		}
	}
	test(&r.Canonicalization, bytes.Equal(retained, b), "receipt_body_mismatch")
	message := append([]byte(domain), b...)
	sum := sha256.Sum256(message)
	r.Recomputed = "sha256:" + hex.EncodeToString(sum[:])
	r.CanonicalHex = hex.EncodeToString(b)
	r.PreimageHex = hex.EncodeToString(message)
	test(&r.Hash, r.Recomputed == str(m, "receipt_hash"), "receipt_hash_mismatch")
	test(&r.Signature, primePoint(key) && primePoint(sig[:32]) && ed25519.Verify(key, message, sig), "bad_receipt_signature")
	test(&r.Bootstrap, str(body, "server_key_id") == c.Key, "unexpected_server_key")
	test(&r.Namespace, str(body, "namespace_id") == c.Namespace, "namespace_mismatch")
	seq, _ := strconv.ParseUint(str(body, "sequence"), 10, 64)
	test(&r.Sequence, seq == c.Sequence+1, "sequence_mismatch")
	prev := str(body, "previous_receipt_hash")
	test(&r.Chain, prev == c.Hash && ((seq == 1 && prev == zero) || (seq != 1 && prev != zero)), "chain_link_mismatch")
	if len(r.Failures) == 0 {
		r.Protocol = "pass"
	}
	next.Sequence = seq
	next.Hash = r.Recomputed
	if len(seed) == 32 {
		r.GeneratedSignature = base64.RawURLEncoding.EncodeToString(ed25519.Sign(ed25519.NewKeyFromSeed(seed), message))
	}
	return
}
func main() {
	key := flag.String("key", "", "Trusted ed25519: public key ID (required)")
	ns := flag.String("namespace", "", "Trusted namespace (required)")
	sequence := flag.Uint64("after", 0, "Trusted predecessor sequence; default genesis")
	prev := flag.String("previous", zero, "Trusted predecessor hash; default genesis")
	seedHex := flag.String("test-seed", "", "PUBLIC TEST seed hex, for conformance signing only")
	flag.Parse()
	if !strings.HasPrefix(*key, "ed25519:") || !uuidRE.MatchString(*ns) || !hashRE.MatchString(*prev) || *sequence > 9007199254740991 {
		fmt.Fprintln(os.Stderr, "invalid trusted context")
		os.Exit(2)
	}
	if _, e := unb64((*key)[8:], 32); e != nil {
		fmt.Fprintln(os.Stderr, "invalid trusted key")
		os.Exit(2)
	}
	var seed []byte
	if *seedHex != "" {
		var e error
		seed, e = hex.DecodeString(*seedHex)
		if e != nil || len(seed) != 32 {
			fmt.Fprintln(os.Stderr, "invalid test seed")
			os.Exit(2)
		}
	}
	// One complete raw receipt envelope per line; line boundaries are export framing.
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Buffer(make([]byte, 8193), 8194)
	c := Context{*key, *ns, *sequence, *prev}
	intact := true
	count := 0
	encoder := json.NewEncoder(os.Stdout)
	for scanner.Scan() {
		count++
		r, next := check(scanner.Bytes(), c, seed)
		if !intact {
			r.Protocol = "fail"
			r.Failures = append(r.Failures, "predecessor_invalid")
		}
		intact = intact && r.Protocol == "pass"
		c = next
		encoder.Encode(r)
	}
	if scanner.Err() != nil {
		encoder.Encode(map[string]string{"error": "receipt_too_large"})
		intact = false
	}
	if !intact || count == 0 {
		os.Exit(1)
	}
}
