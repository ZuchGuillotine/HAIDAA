package main

import (
	"bytes"
	"crypto/ed25519"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"os"
	"strings"
	"testing"
)

func fixture(t *testing.T) map[string]any {
	t.Helper()
	raw, e := os.ReadFile("testdata/v0.json")
	if e != nil {
		t.Fatal(e)
	}
	d := json.NewDecoder(bytes.NewReader(raw))
	d.UseNumber()
	var f map[string]any
	if e = d.Decode(&f); e != nil {
		t.Fatal(e)
	}
	return f
}
func contextOf(f map[string]any) Context {
	c := f["trusted_context"].(map[string]any)
	return Context{Key: str(c, "server_key_id"), Namespace: str(c, "namespace_id"), Hash: zero}
}
func encoded(v any) []byte {
	b, e := json.Marshal(v)
	if e != nil {
		panic(e)
	}
	return b
}
func contains(a []string, s string) bool {
	for _, v := range a {
		if v == s {
			return true
		}
	}
	return false
}
func TestGoldenCrossLanguage(t *testing.T) {
	f := fixture(t)
	c := contextOf(f)
	seed, _ := hex.DecodeString(str(f, "test_seed_hex"))
	for _, item := range f["positive"].([]any) {
		v := item.(map[string]any)
		r, next := check(encoded(v["receipt"]), c, seed)
		if r.Protocol != "pass" {
			t.Fatal(r)
		}
		for _, pair := range [][2]string{{r.CanonicalHex, str(v, "canonical_hex")}, {r.PreimageHex, str(v, "preimage_hex")}, {r.GeneratedSignature, str(v["receipt"].(map[string]any), "signature")}, {r.Recomputed, "sha256:" + str(v, "sha256_hex")}} {
			if pair[0] != pair[1] {
				t.Fatalf("golden mismatch: %v", pair)
			}
		}
		if r.CanonicalHex != hex.EncodeToString([]byte(str(v, "canonical_utf8"))) || r.PreimageHex != hex.EncodeToString([]byte(str(v, "preimage"))) {
			t.Fatal("UTF-8 mismatch")
		}
		m, _ := hex.DecodeString(r.PreimageHex)
		digest := sha256.Sum256(m)
		if hex.EncodeToString(digest[:]) != str(v, "sha256_hex") {
			t.Fatal("SHA-256 mismatch")
		}
		sig, _ := base64.RawURLEncoding.DecodeString(r.GeneratedSignature)
		if !ed25519.Verify(ed25519.NewKeyFromSeed(seed).Public().(ed25519.PublicKey), m, sig) {
			t.Fatal("Go-generated signature invalid")
		}
		c = next
	}
}
func TestAdversarial(t *testing.T) {
	f := fixture(t)
	for _, item := range f["cases"].([]any) {
		v := item.(map[string]any)
		t.Run(str(v, "name"), func(t *testing.T) {
			c := contextOf(f)
			if key := str(v, "key"); key != "" {
				c.Key = key
			}
			raw, e := hex.DecodeString(str(v, "raw_hex"))
			if e != nil {
				t.Fatal(e)
			}
			r, _ := check(raw, c, nil)
			expected := str(v, "expected_failure")
			if expected == "" {
				if r.Protocol != "pass" {
					t.Fatal(r)
				}
			} else if r.Protocol != "fail" || !contains(r.Failures, expected) {
				t.Fatalf("want %s, got %+v", expected, r)
			}
		})
	}
}
func TestInvalidChains(t *testing.T) {
	f := fixture(t)
	for _, item := range f["chains"].([]any) {
		v := item.(map[string]any)
		t.Run(str(v, "name"), func(t *testing.T) {
			c := contextOf(f)
			found := false
			for _, receipt := range v["receipts"].([]any) {
				r, next := check(encoded(receipt), c, nil)
				found = found || contains(r.Failures, str(v, "expected_failure"))
				c = next
			}
			if !found {
				t.Fatal("invalid chain accepted")
			}
		})
	}
}
func TestLiveEvidence(t *testing.T) {
	raw, e := os.ReadFile("testdata/live/trusted-context.json")
	if e != nil {
		t.Fatal(e)
	}
	var trust struct {
		Key       string `json:"server_key_id"`
		Namespace string `json:"namespace_id"`
		Previous  struct {
			Sequence string `json:"sequence"`
			Hash     string `json:"receipt_hash"`
		} `json:"predecessor"`
	}
	if json.Unmarshal(raw, &trust) != nil {
		t.Fatal("bad context")
	}
	if trust.Previous.Sequence != "3" {
		t.Fatal("unexpected sample checkpoint")
	}
	for _, name := range []string{"receipts", "altered"} {
		t.Run(name, func(t *testing.T) {
			b, e := os.ReadFile("testdata/live/" + name + ".ndjson")
			if e != nil {
				t.Fatal(e)
			}
			c := Context{trust.Key, trust.Namespace, 3, trust.Previous.Hash}
			lines := strings.Split(strings.TrimSpace(string(b)), "\n")
			if len(lines) != 2 {
				t.Fatal("expected two receipts")
			}
			for i, line := range lines {
				r, next := check([]byte(line), c, nil)
				if name == "receipts" && r.Protocol != "pass" {
					t.Fatal(r)
				}
				if name == "altered" {
					if i == 0 && (r.Hash != "fail" || r.Signature != "fail") {
						t.Fatal(r)
					}
					if i == 1 && r.Chain != "fail" {
						t.Fatal(r)
					}
				}
				c = next
			}
		})
	}
}
