const pg = require('pg')
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/contacts'
const client = new pg.Client(connectionString)
client.connect()

const query = function(sql, variables, callback){
  console.log('QUERY ->', sql.replace(/[\n\s]+/g, ' '), variables)

  client.query(sql, variables, function(error, result){
    if (error){
      console.log('QUERY <- !!ERROR!!')
      console.error(error)
      callback(error)
    }else{
      console.log('QUERY <-', JSON.stringify(result.rows))
      callback(error, result.rows)
    }
  })
}

const getContacts = function(callback){
  query(`
    SELECT
      *
    FROM
      contacts
  `, [], callback)
}

module.exports = {
  getContacts,
}
