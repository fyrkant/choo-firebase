const html = require('choo/html')
const C = require('../constants')

const buttonMaker = (name, cb, ...cbArgs) =>
  html`<button type="button" onclick=${e => cbArgs.length ? cb(...cbArgs) : cb(e)} >${name}</button>`

const quote = (quote, qid, quoteState, auth, send) => {
  const onSubmit = event => {
    event.preventDefault()
    const content = event.target.parentElement.querySelector('input').value
    const {uid, username} = auth

    send('quotes:submitQuoteEdit', { content, qid, uid, username })
  }
  if (quoteState === C.EDITING_QUOTE) {
    return html`
      <div class="quote">
        <input type="text" value=${quote.content} />
        ${buttonMaker('Cancel', send, 'quotes:setFinishedEditing', { qid })}
        ${buttonMaker('Submit', onSubmit)}
      </div>
    `
  }

  let button
  if (quote.uid !== auth.uid) {
    button = ''
  } else if (quoteState === C.SUBMITTING_QUOTE) {
    button = html`<button disabled>Submitting...</button>`
  } else {
    button = html`
      <span>
        ${buttonMaker('Edit', send, 'quotes:setIsEditing', { qid })}
        ${buttonMaker('Delete', send, 'quotes:deleteQuote', { qid })}
      </span>`
  }

  return html`
    <div class="quote">
      <span class="author">${quote.username} said: </span>
      ${quote.content} ${button}
    </div>
  `
}

module.exports = quote
