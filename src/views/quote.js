const choo = require('choo')
const C = require('../constants')

const quote = (quote, qid, quoteState, auth, send) => {
  const onSubmit = event => {
    event.preventDefault()
    console.log(event)
    const content = event.target.parentElement.querySelector('input').value
    const {uid, username} = auth

    send('quotes:submitQuoteEdit',
      {
        content,
        qid,
        uid,
        username
      })
  }
  let button

  if (quoteState === C.EDITING_QUOTE) {
    return choo.view`
      <div class="quote">
        <input type="text" value=${quote.content} />
        <button type="button" onclick=${e => send('quotes:setFinishedEditing', { qid })} >Cancel</button>
        <button type="button" onclick=${onSubmit}>Submit</button>
      </div>
    `
  }
  if (!quote.uid === auth.uid) {
    button = ''
  } else if (quoteState === C.SUBMITTING_QUOTE) {
    button = choo.view`<button disabled>Submitting...</button>`
  } else {
    button = choo.view`
      <span>
        <button type="button" onclick=${e => send('quotes:setIsEditing', { qid })}>Edit</button>
        <button type="button" onclick=${e => send('quotes:deleteQuote', { qid })}>Delete</button>
      </span>`
  }
  return choo.view`
    <div class="quote">
      <span class="author">${quote.username} said: </span>
      ${quote.content} ${button}
    </div>
  `
}

module.exports = quote
