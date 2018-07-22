const { getFailures, getErrors } = require('../../parsers/jestParser')

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
        link,
        failures: getFailures(log)
      })
    } else if (outcome === 'errored') {
      return constructErroredComment({
        audience,
        sha,
        log,
        link,
        errors: getErrors(log)
      })
    }
  }
}

module.exports = commentHelpers
