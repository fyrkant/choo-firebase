const choo = require('choo')
const map = require('lodash/map')
const quote = require('./quote')

const quotesList = (quotes, auth, send) => {
 const rows = map(quotes.data, (quote, qid) => {
  const quoteState = quotes.states[qid]
  return quote(quote, id, quoteState, send)
 })
}

module.exports = quotesList
