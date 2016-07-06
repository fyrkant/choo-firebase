const html = require('choo/html')

const authPanel = require('./auth-panel')
const feedbackPanel = require('./feedback-panel')
const quotesList = require('./quotes-list')

const mainView = (state, prev, send) => {
  return html`
    <div class="wrapper">
      ${authPanel(state.auth, send)}
      <div class="center">
       ${feedbackPanel(state.feedback, send)}
       ${quotesList(state.quotes, state.auth, send)}
      </div>
    </div>
  `
}

module.exports = mainView
