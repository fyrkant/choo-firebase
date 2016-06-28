const choo = require('choo')
const sf = require('sheetify')

// Firebase setup and initialization
const firebase = require('firebase/app')
require('firebase/auth')
require('firebase/database')
const firebaseConfig = {
  apiKey: 'AIzaSyBMVVNLAtPx2jXrpbhU_3dnxpAPhrO6raE',
  authDomain: 'choo-firebase-2ec21.firebaseapp.com',
  databaseURL: 'https://choo-firebase-2ec21.firebaseio.com'
}
firebase.initializeApp(firebaseConfig)

// Sheetify
sf('./styles.css', { global: true })

// Models
const authModel = require('./models/auth')
const feedbackModel = require('./models/feedback')

// Views
const authPanel = require('./views/auth-panel')
const feedbackPanel = require('./views/feedback-panel')
const quotesList = require('./views/quotes-list')

const app = choo()

app.model(authModel)
app.model(feedbackModel)

const mainView = (params, state, send) => {
  console.log(state)
  return choo.view`
    <div class="wrapper">
      ${authPanel(state.auth, send)}
      <div class="center">
       ${feedbackPanel(state.feedback, send)}
      </div>
    </div>
  `
}

app.router(route => [
  route('/', mainView)
])

const tree = app.start()
document.body.appendChild(tree)
