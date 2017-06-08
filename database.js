const pg = require('pg')
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/contacts'
const client = new pg.Client(connectionString)
client.connect()

const getContacts = function(){
  return new Promise(function(resolve, reject) {
    client.query(`
      SELECT
        *
      FROM
        contacts
    `).then(data => {
      resolve(data.rows);
    }).catch(err => {
      reject(err);
    })
  })
}

var getContactById = function(id) {
  return new Promise(function(resolve, reject) {
    client.query(`
      SELECT
        *
      FROM
        contacts
      WHERE
        id = $1::int
    `, [id]).then(data => {
      resolve(data.rows[0]);
    }).catch(err => {
      reject(err);
    })
  })
}

module.exports = {
  getContacts,
  getContactById
}
