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

var addContact = function(params) {
  console.log(params.name)
  return new Promise(function(resolve, reject) {
    client.query('INSERT INTO contacts (name, email, phone, street, city, state, country, zip, birthday, website) VALUES ($1::text,$2::text,$3::text,$4::text,$5::text,$6::text,$7::text,$8::text,$9::text,$10::text)', [params.name, params.email, params.phone, params.street, params.city, params.state, params.country, params.zip, params.birthday, params.website]).then(res => {
      client.query('SELECT * FROM contacts ORDER BY id DESC LIMIT 1').then(data => {
        resolve(data.rows[0])
      }).catch(err => {
        reject(err);
      })
  })
})
}



module.exports = {
  getContacts,
  getContactById,
  addContact
}
