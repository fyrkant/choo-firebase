const choo = require('choo')

const authPanel = require('./auth-panel')
const feedbackPanel = require('./feedback-panel')
const quotesList = require('./quotes-list')

const mainView = (params, state, send) => {
  console.log(state)
  return choo.view`
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
