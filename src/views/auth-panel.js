const html = require('choo/html')
const C = require('../constants')

const authPanel = (auth, send) => {
  switch (auth.currently) {
    case C.LOGGED_IN:
      return html`
        <div class="authpanel">
          <span>Logged in as ${auth.username}.</span>
          <button onclick=${e => send('auth:logoutUser')}>Log out</button>
        </div>
      `
    case C.AWAITING_AUTH_RESPONSE:
      return html`
        <div class="authpanel">
          <button disabled><i className="fa fa-spinner fa-spin"></i> authenticating...</button>
        </div>
      `
    default:
      return html`
        <div class="authpanel">
          <button onclick=${e => send('auth:attemptLogin')}>Log in</button>
        </div>
      `
  }
}

module.exports = authPanel
