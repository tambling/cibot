const constructPassedComment = ({audience, sha, link}) => `
Hi @${audience}, your commit at ${sha} passed all of its tests!

For more details, you can see the whole build log <a href="${link}" target="_blank">here</a>.
`

module.exports = constructPassedComment
