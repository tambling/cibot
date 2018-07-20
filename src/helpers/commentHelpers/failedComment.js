const { getFailures } = require('../../parsers/JestParser')

const constructFailedComment = ({audience, sha, log, link}) => {
  const failures = getFailures(log)
  const plural = failures.length > 1

  return `
Hey @${audience}, looks like your commit at ${sha} had ${plural ? 'some' : 'a'} failing test${plural && 's'}: 
<ul>
${getFailures(log).map(line => `<li><code>${line}</code></li>`).join('\n')}
</ul> 
You might want to get ${plural ? 'those' : 'that'} test${plural && 's'} passing and update this PR. For more details, you can see the whole build log <a href="${link}" target="_blank">here</a>.
`
}

module.exports = constructFailedComment
