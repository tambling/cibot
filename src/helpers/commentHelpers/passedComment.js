const constructPassedComment = ({audience, sha, link}) => `
Hey @${audience}, your commit at ${sha} passed all of its tests! One of my human colleagues should show up soon to hopefully give this a :thumbsup:.

For more details, you can see the whole build log <a href="${link}" target="_blank">here</a>.
`

module.exports = constructPassedComment
