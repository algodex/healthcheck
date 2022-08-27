require('dotenv').config();

const PouchDB = require('pouchdb');
const addView = require('./add_view');

console.log(process.env.MONITOR_MOUNTS) // remove this after you've confirmed it working

const monitorMounts = JSON.parse(process.env.MONITOR_MOUNTS!);
const fullCouchUrl = process.env.COUCHDB_BASE_URL! + '/' + process.env.COUCHDB_DB_NAME!;

const db = new PouchDB(fullCouchUrl);

class FileSystemUsage {
  file_system: string;
  size: string;
  used: string;
  available: string;
  use_percent: Number;
  mounted_on: string;
}

const displayHeaderToHeaderKey = {
  'Filesystem': 'file_system',
  'Size': 'size',
  'Used': 'used',
  'Avail': 'available',
  'Capacity': 'capacity',
  'Use%': 'use_percent',
  '%iused': 'use_percent',
  'Mounted': 'mounted_on',
};

const monitorMountsSet = new Set(monitorMounts);

const { execSync } = require('child_process');

const hostname = execSync('hostname').toString().replace("\n","");
const external_ipaddr = execSync('dig +short txt ch whoami.cloudflare @1.0.0.1')
  .toString().replaceAll("\n","").replaceAll('"','');
const diskspace:String = execSync('df -h').toString();
console.log(diskspace);

const regexp = /\s*([^\s])+\s*/gi;

const lines = diskspace.split(/\r?\n/);

const firstLine = lines[0];

const separated:Array<string> = firstLine.match(regexp)!.map(entry => entry.trim());

let i = 0;
const indexToHeader = separated.reduce((map, entry) => {
  const headerKey = displayHeaderToHeaderKey[entry];
  if (headerKey !== undefined) {
    map.set(i, headerKey);
  }
  i++;
  return map;
}, new Map<number,string>);


const filesystems = lines.slice(1)
  .filter(line => line.match(regexp))
  .map(line => line.match(regexp)!.map(entry => entry.trim()))
  .reduce( (disks, separated) => {
    let filesystem = new FileSystemUsage;
    for (let i = 0; i < separated.length; i++) {
      const word = separated[i];
      const key = indexToHeader.get(i);
      if (key !== undefined) {
        filesystem[key] = word;
      }
    }
    if (monitorMountsSet.has(filesystem.mounted_on)) {
      disks.push(filesystem);
    }
    return disks;
  }, new Array<FileSystemUsage>);

const unix_time = Math.round(Date.now() / 1000);
const newDate = new Date(Date.now());
const utc_timestamp = newDate.toUTCString();
console.log(utc_timestamp);
const doc = {
  // _id: process.env.SERVER_NAME,
  // _rev: undefined,
  hostname:hostname,
  external_ipaddr,
  datetime: utc_timestamp,
  unix_time: unix_time,
  filesystem_status: filesystems,
  server_name: process.env.SERVER_NAME
};

db.post(doc);

// db.get(doc._id).then(function(fetchedDoc) {
//   doc._rev = fetchedDoc._rev;
//   return db.put(doc);
// }).then(function(response) {
//   // handle response
// }).catch(function (err) {
//   return db.put(doc);
// });
// console.log({ filesystems });

// addView('asdsa');