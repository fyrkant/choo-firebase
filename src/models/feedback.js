module.exports = {
  namespace: 'feedback',
  state: {
    messages: [
      {msg: 'Welcome to this little demo! It is meant to demonstrate three things:', error: false},
      {msg: '1) How to use choo + Firebase', error: false},
      {msg: '2) How to use authentication in a choo app', error: false},
      {msg: '3) How awesome choo is', error: false}
    ]
  },
  reducers: {
    dismiss: (action, state) => ({
      messages: state.messages.filter((msg, i) => action.num !== i)
    }),
    displayError: (action, state) => state.messages.concat({ msg: action.error, error: true }),
    displayMessage: (action, state) => state.messages.concat({ msg: action.message, error: false })
  }
}
