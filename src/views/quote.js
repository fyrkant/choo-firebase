const choo = require('choo')
const C = require('../constants')

const buttonMaker = (name, cb, ...cbArgs) =>
  choo.view`<button type="button" onclick=${e => cb(...cbArgs, e)} >${name}</button>`

const quote = (quote, qid, quoteState, auth, send) => {
  const onSubmit = event => {
    event.preventDefault()
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
  if (quoteState === C.EDITING_QUOTE) {
    return choo.view`
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
    button = choo.view`<button disabled>Submitting...</button>`
  } else {
    button = choo.view`
      <span>
        ${buttonMaker('Edit', send, 'quotes:setIsEditing', { qid })}
        ${buttonMaker('Delete', send, 'quotes:deleteQuote', { qid })}
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
