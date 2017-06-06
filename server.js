const express = require('express')
const bodyParser = require('body-parser')
const database = require('./database')
const app = express()
var logger = require('morgan')

require('ejs')
app.set('view engine', 'ejs');

app.use(express.static('public'))
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }))

//commenting out the arrow functions cause they're harder to read
// app.get('/', (request, response) => {
//   database.getContacts((error, contacts) => {
//     if (error) {
//       response.status(500).render('error.ejs', {
//         error: error,
//       })
//     } else {
//       response.render('index.ejs', {
//         contacts: contacts,
//       })
//     }
//   })
// })

app.get('/', function(req, res) {
  database.getContacts(function(error, contacts) {
    if (error) {
      res.status(500).render('error.ejs', {
        error: error
      })
    } else {
      res.render('index.ejs', {
        contacts:contacts
      })
    }
  })
})

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).send("Something went wrong");
})
app.use((request, response) => {
  response.status(404).render('not_found')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`)
})
