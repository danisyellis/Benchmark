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
    `).then(res => {
      console.log('result of query: ' + res.rows[0].name);
      resolve(res.rows);
    })
    .catch(err => {
      reject(err)
    })
  })
}

module.exports = {
  getContacts,
}
