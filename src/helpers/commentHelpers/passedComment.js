const constructPassedComment = ({audience, sha, link}) => `
Hey @${audience}, your commit at ${sha} passed all of its tests! One of my human colleagues should show up soon to hopefully give this a :thumbsup:.

If you want more details about the build, you can find them <a href="${link}" target="_blank">here</a>.
`

module.exports = constructPassedComment;
