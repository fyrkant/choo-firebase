const choo = require('choo')
const C = require('../constants')

const quote = (quote, id, quoteState, send) => {
  if (quoteState === C.EDITING_QUOTE) {
    return choo.view`
      <form ></form>
    `
  }

}

module.exports = quote
