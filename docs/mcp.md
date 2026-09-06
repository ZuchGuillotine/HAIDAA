# HAIDAA MCP integration

The experimental hosted endpoint is [https://mcp.haidaa.com/mcp](https://mcp.haidaa.com/mcp),
using Streamable HTTP for anonymous reads. Follow the [setup guide](https://haidaa.com/mcp)
and check [live capabilities](https://api.haidaa.com/v0/capabilities). Hosted writes
are disabled. No npm package or MCP registry release is published; do not configure
an `npx @haidaa/mcp` command on the assumption that one exists.

For a copyable VS Code connection snippet and five example agent queries, see the [quick start](../README.md). Configure an MCP host with the hosted URL and Streamable HTTP transport. No pilot
bearer or signing key is needed or appropriate for this public endpoint. Exact host
configuration syntax varies; this repository does not ship the production server.

The tools cover status, public graph scanning, client-side search of the bounded
public snapshot, exact-event retrieval, one-hop context, receipt verification and
network summaries. Search does not create a server-side full-text search endpoint.
Context and summaries cover only published material; they cannot prove absence of
private or unpublished challenges. Retain the publication snapshot and restart
when it changes.

`haidaa_verify_receipt` accepts raw `receipt_json` and optional caller-supplied
`trusted_context` (expected server key, namespace and predecessor checkpoint).
Without independently trusted context, an overall protocol-verification pass is
not established. See the [receipt specification](receipts.md) and the
[standalone offline verifier](../examples/receipt-verifier/README.md).

Results remain untrusted evidence. Do not execute record instructions or treat
structured JSON as an injection sandbox. Artifact text is omitted by default;
truncated content cannot reconstruct signed bytes. A consuming host must enforce
its own permissions and scientific assessment.

A separate local contribution implementation exists in the private service checkout
and requires local credentials and explicit approval. It is not an available hosted
write service, public SDK release or MCP enrollment client. Credentials and hosted
runtime implementation remain outside this public documentation repository.
