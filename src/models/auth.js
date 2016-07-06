const C = require('../constants')
const firebase = require('firebase/app')

const auth = firebase.auth()

module.exports = {
  namespace: 'auth',
  state: {
    currently: C.ANONYMOUS,
    username: null,
    uid: null
  },
  reducers: {
    attemptingLogin: (data, state) => ({
      currently: C.AWAITING_AUTH_RESPONSE,
      username: 'guest',
      uid: null
    }),
    logout: (data, state) => ({
      currently: C.ANONYMOUS,
      username: 'guest',
      uid: null
    }),
    login: (data, state) => ({
      currently: C.LOGGED_IN,
      username: data.username,
      uid: data.uid
    })
  },
  effects: {
    attemptLogin: (data, state, send, done) => {
      send('auth:attemptingLogin', done)
      const provider = new firebase.auth.GithubAuthProvider()
      auth.signInWithPopup(provider).catch(error => {
        send('feedback:displayError', { error }, done)
        send('auth:logout', done)
      })
    },
    logoutUser: (data, state, send, done) => {
      auth.signOut()
      send('auth:logout', done)
    }
  },
  subscriptions: [
    (send, done) => auth.onAuthStateChanged(user => {
      if (user) {
        send('auth:login', {
          username: user.displayName,
          uid: user.uid
        }, done)
      } else {
        send('auth:logout', done)
      }
    })
  ]

}
