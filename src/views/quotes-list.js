const html = require('choo/html')
const map = require('lodash/map')
const quote = require('./quote')

const quotesList = (quotes, auth, send) => {
  const onSubmit = event => {
    event.preventDefault()

    const content = event.target.querySelector('input').value
    const {uid, username} = auth

    send('quotes:submitNewQuote', { uid, username, content })
    event.target.querySelector('input').value = ''
  }

  const rows = map(quotes.data, (q, qid) => {
    const quoteState = quotes.states[qid]
    return quote(q, qid, quoteState, auth, send)
  }).reverse()

  return html`
  <div class="quoteslist">
    ${auth.uid
      ? html`
          <form class="newquoteform" onsubmit=${onSubmit}>
            <input type="text" name="quote" />
            <button type="submit" disabled=${quotes.submittingNew}>
              ${quotes.submittingNew ? 'Submitting...' : 'Submit'}
            </button>
          </form>`
      : html`<p>Log in to add a new quote of your own!</p>`}
    ${quotes.hasReceivedData ? rows : 'Loading quotes...'}
  </div>
  `
}

module.exports = quotesList
