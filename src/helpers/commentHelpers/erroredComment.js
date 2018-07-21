const { getErrors } = require('../../parsers/JestParser')

const constructErroredComment = ({ audience, sha, log, link }) => {
  const errors = getErrors(log)

  if (errors.length > 5) {
    return `
Hi @${audience}, the CI build for your commit at ${sha} had an error. The error message began with: 
<pre>${errors[0]}</pre>
For more details, you can see the whole build log <a href="${link}" target="_blank">here</a>.
    `
  } else if (errors.length > 0 && errors.length <= 5) {
    return `
Hi @${audience}, the CI build for your commit at ${sha} had an error. The error message was: 
<pre>${errors.join('\n')}</pre>
For more details, you can see the whole build log <a href="${link}" target="_blank">here</a>.
    `
  } else {
    return `
Hi @${audience}, the CI build for your commit at ${sha} had an error.
<br />
For more details, you can see the whole build log <a href="${link}" target="_blank">here</a>.
`
  }
}

module.exports = constructErroredComment
