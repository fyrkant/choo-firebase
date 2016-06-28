const choo = require('choo')

const feedbackPanel = (feedback, send) => {
  const rows = feedback.messages.map((f, n) => {
    return choo.view`
      <div class="feedback ${f.error && 'error'}">
        ${f.msg}
        <button onclick=${e => send('feedback:dismiss', {num: n})}>X</button>
      </div>
    `
  })
  return choo.view`
    <div class="feedbacklist">
      ${rows}
    </div>
  `
}

module.exports = feedbackPanel
