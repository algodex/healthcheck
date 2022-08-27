# healthcheck
This is a monitoring system for Algodex services. It periodically stores the data in a CouchDB database where it can be viewed easily later.

## Setup (Ubuntu)

### Install Node.js

```
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Install TypeScript
`sudo apt install node-typescript`

Set up .env file
`cp .env.example .env`

Remember to edit the above.

| Environment Var  | Description                                                                                                     |
|------------------|-----------------------------------------------------------------------------------------------------------------|
| COUCHDB_BASE_URL | The URL to the remote CouchDB Server. This should also contain the credentials and port.                        |
| COUCHDB_DB_NAME  | Database name. You can leave this as the default.                                                               |
| MONITOR_MOUNTS   | Filesystem mounts that you wish to monitor.                                                                     |
| SERVER_NAME      | Provide a unique name for the server. It is important to keep it unique so it does not overwrite other servers. |

### Install npm modules

`npm install`

## Run

`npm run compile-and-run`

After it is compiled, you can run it more simply with:

`npm run run-only` or `node built/index.js`

## Cron Setup (todo)

### healthchecks.io setup (todo)


