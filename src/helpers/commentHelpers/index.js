const constructPassedComment = require('./passedComment')
const constructFailedComment = require('./failedComment')
const constructErroredComment = require('./erroredComment')

const commentHelpers = {
  commentAttributesFromPullRequest: pullRequest => ({
    audience: pullRequest.user.login,
    sha: pullRequest.head.sha
  }),

  commentAttributesFromBuild: async (build) => {
    const log = await build.getLog()

    return {
      outcome: build.state,
      link: build.webLink,
      log: log.content
    }
  },

  attributesToCommentBody: ({ audience, sha, outcome, link, log }) => {
    if (outcome === 'passed') {
      return constructPassedComment({
        audience,
        sha,
        link
      })
    } else if (outcome === 'failed') {
      return constructFailedComment({
        audience,
        sha,
        log,
        link
      })
    } else if (outcome === 'errored') {
      return constructErroredComment({
        audience,
        sha,
        log,
        link
      })
    }
  }
}

module.exports = commentHelpers
