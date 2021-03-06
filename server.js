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

var makeGoogleAddress = function(contact) {
  var fullAddress = contact.street + ", " +contact.city + ", " + contact.state + " " + contact.zip;
  googleAddress = fullAddress.replace(/\s/g, '+');
  return googleAddress;
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

app.post('/contacts/new', function(req, res) {
  //call a function that adds this person to the db
  //grab the id
  //render contacts/ that id
  database.addContact(req.body).then(function(contact) {
    console.log(contact)
    var addressForGoogle = makeGoogleAddress(contact);
    res.render('contact.ejs', {
      contact: contact,
      addressForGoogle: addressForGoogle
    });

  })
})


app.get('/contacts/:id', function(req, res) {
  database.getContactById(req.params.id).then(function(contact) {
    var addressForGoogle = makeGoogleAddress(contact);
    res.render('contact.ejs', {
      contact:contact,
      addressForGoogle: addressForGoogle
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
