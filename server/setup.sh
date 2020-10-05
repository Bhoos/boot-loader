#!/bin/bash
boot-loader \
  --app "boot-loader-server" \
  --owner "bhoos" \
  --type "development" \
  --directory "/boot-loader-server" \
  --user "bhoos" \
  --env "MYSQL_USER=bhoos" "MYSQL_PASS=****"

