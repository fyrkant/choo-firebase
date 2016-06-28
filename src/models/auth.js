const C = require('../constants')
const firebase = require('firebase/app')
require('firebase/auth')

const auth = firebase.auth()

module.exports = {
  namespace: 'auth',
  state: {
    currently: C.ANONYMOUS,
    username: null,
    uid: null
  },
  reducers: {
    attemptingLogin: (action, state) => ({
      currently: C.AWAITING_AUTH_RESPONSE,
      username: 'guest',
      uid: null
    }),
    logout: (action, state) => ({
      currently: C.ANONYMOUS,
      username: 'guest',
      uid: null
    }),
    login: (action, state) => ({
      currently: C.LOGGED_IN,
      username: action.username,
      uid: action.uid
    })
  },
  effects: {
    attemptLogin: (action, state, send) => {
      send('auth:attemptingLogin')
      const provider = new firebase.auth.GithubAuthProvider()
      auth.signInWithPopup(provider).catch(error => {
        send('feedback:displayError', { error })
        send('auth:logout')
      })
    },
    logoutUser: (action, state, send) => {
      send('auth:logout')
      auth.signOut()
    }
  },
  subscriptions: [
    send => auth.onAuthStateChanged(user => {
      if (user) {
        send('auth:login', {
          username: user.displayName,
          uid: user.uid
        })
      } else {
        send('auth:logout')
      }
    })
  ]

}
