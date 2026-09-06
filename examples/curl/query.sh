#!/bin/sh
set -eu
curl --fail-with-body --silent --show-error --max-time 30 https://api.haidaa.com/v0/capabilities
printf '\n'
curl --fail-with-body --silent --show-error --max-time 30 https://api.haidaa.com/v0/schema
printf '\n'
curl --fail-with-body --silent --show-error --max-time 30 'https://api.haidaa.com/public/graph?limit=5'
printf '\n'
