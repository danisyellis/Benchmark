const express = require('express')
const bodyParser = require('body-parser')
const database = require('./database')
const app = express()
var logger = require('morgan')

//helper functions
var alphabetizeContacts = function(contacts) {
  contacts.sort(function(a,b) {
    var nameA = a.name.toUpperCase();
    var nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameB < nameA) {
      return 1;
    }
    return 0;
  });
}

require('ejs')
app.set('view engine', 'ejs');

app.use(express.static('public'))
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res) {
  database.getContacts().then(function(contacts) {
    alphabetizeContacts(contacts);
    res.render('index.ejs', {
      contacts:contacts
    })
  }).catch(function(err) {
    res.status(500).render('error.ejs', {
      error: err
    })
  })
});

app.get('/contacts/new', function(req, res) {
  res.render('newContact.ejs');
})

app.get('/contacts/:id', function(req, res) {
  database.getContactById(req.params.id).then(function(contact) {
    console.log('contact name: '+ contact.name)
    res.render('contact.ejs', {
      contact:contact
    })
  }).catch(function(err) {
    res.status(500).render('error.ejs', {
      error: err
    })
  })
});

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
