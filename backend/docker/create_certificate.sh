#!/usr/bin/env zsh

set -euo pipefail

cwd=${0:a:h}
server_key="${cwd}/server.key"
server_crt="${cwd}/server.crt"

# exit if the files already exist
if [[ -f "$server_key" ]] || [[ -f "$server_crt" ]]; then
  echo "The files $server_key and $server_crt already exist, exiting"
  exit 1
fi

# Create a self-signed certificate for the local Postgres database server
# Inspired by https://serverfault.com/questions/224122/what-is-crt-and-key-files-and-how-to-generate-them
echo "Just press enter for all input fields, the data is not important"
openssl genrsa 2048 > "$server_key"
chmod 400 "$server_key"
openssl req -new -x509 -nodes -sha256 -days 365 -key "$server_key" -out "$server_crt"