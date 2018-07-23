const { getFailures, getErrors } = require('../../parsers/jestParser')

const constructPassedComment = require('./passedComment')
const constructFailedComment = require('./failedComment')
const constructErroredComment = require('./erroredComment')

const commentHelpers = {
  // Get comment attributes out of a raw Probot "pull request" payload.
  commentAttributesFromPullRequest: pullRequest => ({
    audience: pullRequest.user.login,
    sha: pullRequest.head.sha
  }),

  // Get comment attributes out of an instance of Build.
  commentAttributesFromBuild: async (build) => {
    const log = await build.getLog()

    return {
      outcome: build.state,
      link: build.webLink,
      log: log.content
    }
  },

  // Route the attributes from the above two methods to the right comment
  // interpolator.
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
        link,
        failures: getFailures(log)
      })
    } else {
      return constructErroredComment({
        audience,
        sha,
        link,
        errors: getErrors(log)
      })
    }
  }
}

module.exports = commentHelpers
