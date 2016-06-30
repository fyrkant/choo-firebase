const choo = require('choo')
const map = require('lodash/map')
const quote = require('./quote')

const quotesList = (quotes, auth, send) => {
  const onSubmit = event => {
    event.preventDefault()

    let content = event.target.querySelector('input').value

    send('quotes:submitNewQuote',
      {
        uid: auth.uid,
        username: auth.username,
        content
      }
    )
    event.target.querySelector('input').value = ''
  }

  const rows = map(quotes.data, (q, qid) => {
    const quoteState = quotes.states[qid]
    return quote(q, qid, quoteState, auth, send)
  }).reverse()

  return choo.view`
  <div class="quoteslist">
    ${auth.uid
      ? choo.view`
          <form class="newquoteform" onsubmit=${onSubmit}>
            <input type="text" name="quote" />
            <button type="submit" disabled=${quotes.submittingNew}>
              ${quotes.submittingNew ? 'Submitting...' : 'Submit'}
            </button>
          </form>`
      : choo.view`<p>Log in to add a new quote of your own!</p>`}
    ${quotes.hasReceivedData ? rows : 'Loading quotes...'}
  </div>
  `
}

module.exports = quotesList
