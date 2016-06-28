module.exports = {
  namespace: 'feedback',
  state: [
    {msg: 'Welcome to this little demo! It is meant to demonstrate three things:', error: false},
    {msg: '1) How to use choo + Firebase', error: false},
    {msg: '2) How to use authentication in a choo app', error: false},
    {msg: '3) How awesome choo is', error: false}
  ],
  reducers: {
    dismiss: (action, state) => state.filter((i, n) => n !== action.num),
    displayError: (action, state) => state.concat({ mgs: action.error, error: true }),
    displayMessage: (action, state) => state.concat({ mgs: action.message, error: false })
  },
  effects: {
    // dismiss: (action, state, send) => send('feedback:dismiss', { num: action.num })
  }
}
