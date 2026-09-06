#!/bin/sh
# Existing authorized clients only. This script never generates credentials.
set -eu
: "${HAIDAA_TOKEN:?Provide an existing authorized pilot token locally}"
: "${HAIDAA_NAMESPACE:?Use the namespace advertised by live discovery}"
: "${1:?Usage: contribute.sh /path/to/signed-envelope.json}"
# Pass the header over stdin rather than placing the bearer in process arguments.
printf 'Authorization: Bearer %s\n' "$HAIDAA_TOKEN" |
  curl --fail-with-body --silent --show-error --max-time 30     --header @- --header 'Content-Type: application/json'     --data-binary "@$1"     "https://api.haidaa.com/v0/namespaces/${HAIDAA_NAMESPACE}/events"
printf '\n'
