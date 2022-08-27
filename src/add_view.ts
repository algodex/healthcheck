

require('dotenv').config();
function emit(a,b) {}

const PouchDB = require('pouchdb');

const mapFunc = function (doc) {
  doc.filesystem_status.forEach(filesystem => {
      emit([doc.server_name, filesystem.mounted_on], {unix_time: doc.unix_time, _id: doc._id});
  });
}
const reduceFunc = function (keys, values, rereduce) {
  let max_time = 0;
  let max_time_index = 0;
  for (let i = 0; i < values.length; i++) {
    if (values[i].unix_time > max_time) {
      max_time = values[i].unix_time;
      max_time_index = i;
    }
  }
  return values[max_time_index];
};

module.exports = function () {
  console.log(process.env.MONITOR_MOUNTS) // remove this after you've confirmed it working

  const monitorMounts = JSON.parse(process.env.MONITOR_MOUNTS!);
  const fullCouchUrl = process.env.COUCHDB_BASE_URL! + '/' + process.env.COUCHDB_DB_NAME!;
  const db = new PouchDB(fullCouchUrl);

  const viewDoc =     {
    _id: '_design/server_status',
    _rev: undefined,
    views: {
      server_status: {map: mapFunc.toString, reduce: reduceFunc.toString()}
    }
  };

  db.get(viewDoc._id).then(function(fetchedDoc) {
    viewDoc._rev = fetchedDoc._rev;
    return db.put(viewDoc);
  }).then(function(response) {
    // handle response
  }).catch(function (err) {
    return db.put(viewDoc);
  });
}

export {};
