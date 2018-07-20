const { getErrors } = require('../../parsers/JestParser')

const constructErroredComment = ({ audience, sha, log, link }) => {
  const errors = getErrors(log)

  if (errors.length > 5) {
    return `
Hey @${audience}, the build for your commit at ${sha} errored out. The error message was a bit too detailed to put in a comment, but here's a preview: 
<pre>${errors[0]}</pre>
For more details, you can see the whole build log <a href="${link}" target="_blank">here</a>.
    `
  } else if (errors.length > 0 && errors.length <= 5) {
    return `
Hey @${audience}, the build for your commit at ${sha} errored out. Here are the error logs I was able to find: 
<pre>${errors.join('\n')}</pre>
For more details, you can see the whole build log <a href="${link}" target="_blank">here</a>.
    `
  } else {
    return `
Hey @${audience}, the build for your commit at ${sha} errored out. I wasn't able to find anything that looked like an Node error, so you should probably check out <a href="${link}" target="_blank">the build</a> and see if you have better luck with it.
`
  }
}

module.exports = constructErroredComment
