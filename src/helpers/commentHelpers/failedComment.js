
const constructFailedComment = ({audience, sha, log, link, failures}) => {
  const plural = failures.length > 1

  return `
Hi @${audience}, your commit at ${sha} failed ${plural ? 'some' : 'a'} test${plural ? 's' : ''}: 
<ul>
${failures.map(line => `<li><code>${line}</code></li>`).join('\n')}
</ul> 
For more details, you can see the whole build log <a href="${link}" target="_blank">here</a>.
`
}

module.exports = constructFailedComment
