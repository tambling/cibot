const { getFailures } = require('../../parsers/JestParser')

const constructFailedComment = ({audience, sha, log, link}) => `
Hey @${audience}, looks like your commit at ${sha} had some failing tests: 
<ul>
${getFailures(log).map(line => `<li><code>${line}</code></li>`).join('\n')}
</ul> 
You might want to get those tests passing and update this PR. For more details, you can see the whole build log <a href="${link}" target="_blank">here</a>
`

module.exports = constructFailedComment
