const html = require('choo/html')

const feedbackPanel = (feedback, send) => {
  const rows = feedback.messages.map((f, n) => {
    return html`
      <div class="feedback ${f.error && 'error'}">
        ${f.msg}
        <button onclick=${e => send('feedback:dismiss', {num: n})}>X</button>
      </div>
    `
  })
  return html`
    <div class="feedbacklist">
      ${rows}
    </div>
  `
}

module.exports = feedbackPanel
