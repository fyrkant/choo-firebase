const assign = require('lodash/assign')
const cloneDeep = require('lodash/cloneDeep')
const C = require('../constants')
const utils = require('../utils')

const firebase = require('firebase/app')
require('firebase/database')

const quotesRef = firebase.database().ref().child('quotes')

module.exports = {
  namespace: 'quotes',
  state: {
    hasReceivedData: false,
    submittingNew: false,
    states: {},
    data: {}
  },
  reducers: {
    receiveQuotesData: (action, state) => assign({}, state, { hasReceivedData: true, data: action.data }),
    awaitNewQuoteResponse: (action, state) => assign({}, state, { submittingNew: true }),
    reveiceNewQuoteResponse: (action, state) => assign({}, state, { submittingNew: false }),
    startQuoteEdit: (action, state) => {
      const newState = cloneDeep(state)
      newState.states[action.qid] = C.EDITING_QUOTE
      return newState
    },
    finishQuoteEdit: (action, state) => {
      const newState = cloneDeep(state)
      delete newState.states[action.qid]
      return newState
    },
    submitQuoteEdit: (action, state) => {
      const newState = cloneDeep(state)
      newState.states[action.qid] = C.SUBMITTING_QUOTES
      return newState
    }
  },
  effects: {
    deleteQuote: (action, state, send) => {
      const qid = action.qid
      send('quotes:submitQuoteEdit', { qid })
      quotesRef.child(qid).remove(error => {
        send('quotes:finishQuoteEdit', qid)
        if (error) {
          send('feedback:displayError', { error: 'Deletion failed! ' + error })
        } else {
          send('feedback:displayMessage', { message: 'Quote successfully deleted!' })
        }
      })
    },
    submitQuoteEdit: (action, state, send) => {
      const {username, uid, qid, content} = action
      const error = utils.validateQuote(content)

      if (error) {
        send('feedback:displayError', { error })
      } else {
        send('quotes:submitQuoteEdit', { qid })
        quotesRef.child(qid).set({content, username, uid})
          .then(() => send('feedback:displayMessage', { message: 'Update successfully saved!' }))
          .catch(error => send('feedback:displayError', { error }))
      }
    },
    submitNewQuote: (action, state, send) => {
      const {content, uid, username} = action
      const error = utils.validateQuote(content)

      if (error) {
        send('feedback:displayError', { error })
      } else {
        send('quotes:awaitNewQuoteResponse')
        quotesRef.push({content, username, uid})
          .then(() => send('feedback:displayMessage', { message: 'Quote successfully saved!' }))
          .catch(error => send('feedback:displayError', { error }))
      }
    }
  },
  subscriptions: [
    send => quotesRef.on('value', snapshot => {
      console.log(snapshot)
      send('quotes:receiveQuotesData', { data: snapshot.val() })
    })
  ]
}
