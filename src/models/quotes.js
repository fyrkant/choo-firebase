const assign = require('lodash/assign')
const cloneDeep = require('lodash/cloneDeep')
const C = require('../constants')
const utils = require('../utils')

const firebase = require('firebase/app')

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
    receiveQuotesData: (data, state) => assign({}, state, { hasReceivedData: true, data: data.data }),
    awaitNewQuoteResponse: (data, state) => assign({}, state, { submittingNew: true }),
    reveiceNewQuoteResponse: (data, state) => assign({}, state, { submittingNew: false }),
    setIsEditing: (data, state) => {
      const newState = cloneDeep(state)
      newState.states[data.qid] = C.EDITING_QUOTE
      return newState
    },
    setFinishedEditing: (data, state) => {
      const newState = cloneDeep(state)
      delete newState.states[data.qid]
      return newState
    },
    setIsSubmitting: (data, state) => {
      const newState = cloneDeep(state)
      newState.states[data.qid] = C.SUBMITTING_QUOTE
      return newState
    }
  },
  effects: {
    deleteQuote: (data, state, send, done) => {
      const qid = data.qid
      send('quotes:setIsEditing', { qid }, done)
      quotesRef.child(qid).remove(error => {
        send('quotes:setFinishedEditing', qid, done)
        if (error) {
          send('feedback:displayError', { error: 'Deletion failed! ' + error }, done)
        } else {
          send('feedback:displayMessage', { message: 'Quote successfully deleted!' }, done)
        }
      })
    },
    submitQuoteEdit: (data, state, send, done) => {
      const {username, uid, qid, content} = data
      const error = utils.validateQuote(content)

      if (error) {
        send('feedback:displayError', { error }, done)
      } else {
        send('quotes:setIsSubmitting', { qid }, done)
        quotesRef.child(qid).set({content, username, uid})
          .then(() => {
            send('feedback:displayMessage', { message: 'Update successfully saved!' }, done)
            send('quotes:setFinishedEditing', { qid }, done)
          })
          .catch(err => {
            send('feedback:displayError', { err })
            send('quotes:setFinishedEditing', { qid }, done)
          })
      }
    },
    submitNewQuote: (data, state, send, done) => {
      const {content, uid, username} = data
      const error = utils.validateQuote(content)

      if (error) {
        send('feedback:displayError', { error }, done)
      } else {
        send('quotes:awaitNewQuoteResponse', done)
        quotesRef.push({content, username, uid})
          .then(() => {
            send('feedback:displayMessage', { message: 'Quote successfully saved!' }, done)
            send('quotes:reveiceNewQuoteResponse', done)
          })
          .catch(error => {
            send('feedback:displayError', { error }, done)
            send('quotes:reveiceNewQuoteResponse', done)
          })
      }
    }
  },
  subscriptions: [
    (send, done) => quotesRef.on('value', snapshot => {
      send('quotes:receiveQuotesData', { data: snapshot.val() }, done)
    })
  ]
}
