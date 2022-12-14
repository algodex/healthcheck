/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();

const express = require('express')

const PouchDB = require('pouchdb')
const PouchMapReduce = require('pouchdb-mapreduce');
PouchDB.plugin(PouchMapReduce)

const app = express()
const port = 3005

const getDatabase = () => {
  const fullUrl = process.env.COUCHDB_BASE_URL + '/' + process.env.COUCHDB_DB_NAME
  // console.log({fullUrl});
  const db = new PouchDB(fullUrl)
  return db
}

app.get('/', async (req, res) => {
  const db = getDatabase();
  const statusData = await db.query('server_status/server_status', {
    reduce: true,
    group: true
  })

  const idSet = new Set();

  const getPromises = statusData.rows
    .map(row => row.value._id)
    .filter(id => {
      const alreadySeen = idSet.has(id);
      idSet.add(id);
      return !alreadySeen;
    })
    .map(id => {
      return db.get(id);
    });

  const allDocs = await Promise.all(getPromises);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(allDocs))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
