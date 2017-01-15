const choo = require('choo')
const sf = require('sheetify')
const mainView = require('./views/main')

// Firebase setup and initialization
const firebase = require('firebase/app')
require('firebase/auth')
require('firebase/database')

firebase.initializeApp({
  apiKey: 'AIzaSyBMVVNLAtPx2jXrpbhU_3dnxpAPhrO6raE',
  authDomain: 'choo-firebase-2ec21.firebaseapp.com',
  databaseURL: 'https://choo-firebase-2ec21.firebaseio.com'
})

// Sheetify
sf('./styles.css', { global: true })

const app = choo()

app.model(require('./models/auth'))
app.model(require('./models/feedback'))
app.model(require('./models/quotes'))

app.router(['/', mainView])

const tree = app.start()
document.body.appendChild(tree)
