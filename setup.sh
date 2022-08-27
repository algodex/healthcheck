#!/bin/bash
set -e

NODE_EXISTS=`node -v`

if [[ "$NODE_EXISTS" =~ ^v[0-9]+.* ]]; then 
  echo "node exists, skipping install"
else
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  sudo apt install -y node-typescript
fi

tsc

rm -f .env

if [[ -z "$MONITOR_MOUNTS" ]]; then
    echo "Must provide MONITOR_MOUNTS in environment" 1>&2
    exit 1
fi

if [[ -z "$COUCHDB_DB_NAME" ]]; then
    echo "Must provide MONITOR_MOUNTS in environment" 1>&2
    exit 1
fi

if [[ -z "$COUCHDB_BASE_URL" ]]; then
    echo "Must provide COUCHDB_BASE_URL in environment" 1>&2
    exit 1
fi

if [[ -z "$SERVER_NAME" ]]; then
    echo "Must provide SERVER_NAME in environment" 1>&2
    exit 1
fi

if [ "$SERVER_NAME" == "name_here" ]; then
    echo "'name_here' is not a valid server name"
    exit 1
fi

if [[ -z "$HEALTHCHECKS_URL" ]]; then
    echo "Must provide HEALTHCHECKS_URL in environment" 1>&2
    exit 1
fi

if [ "$HEALTHCHECKS_URL" == "url_here" ]; then
    echo "'url_here' is not a valid healthchecks URL"
    exit 1
fi

echo "MONITOR_MOUNTS='[\"/\", \"/data\"]'" >> .env
echo "COUCHDB_DB_NAME=server_status" >> .env
echo "COUCHDB_BASE_URL=$COUCHDB_BASE_URL" >> .env
echo "SERVER_NAME=$SERVER_NAME" >> .env

CRON_EXISTS=0
crontab -l | grep -q 'healthcheck' && CRON_EXISTS=1
if [ "$CRON_EXISTS" == "0" ]; then
  echo "Adding to crontab"
  (crontab -l 2>/dev/null; echo "10 * * * * cd /home/ubuntu/healthcheck && npm run run-only && curl -fsS -m 10 --retry 5 -o /dev/null $HEALTHCHECKS_URL") | crontab -  
fi
