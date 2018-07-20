const BuildCollection = require('./src/models/BuildCollection')

const { processPayload } = require('./src/helpers/contextHelpers')

const {
  commentAttributesFromPullRequest,
  commentAttributesFromBuild,
  attributesToCommentBody
} = require('./src/helpers/commentHelpers')

/*
 * This is the entry point for your Probot App.
 * @param {import('probot').Application} app - Probot's Application class.
 */
module.exports = app => {
  app.on('pull_request', async context => {
    const {
      pullRequest,
      owner,
      repo,
      number,
      action
    } = processPayload(context)

    if (action !== 'opened') {
      return null
    }

    const repoSlug = `${owner}/${repo}`

    const repoBuilds = await BuildCollection.getByRepoSlug(repoSlug)
    const matchingBuilds = await repoBuilds.pollForPullRequest(number)
    const latestMatchingBuild = matchingBuilds.latest()

    latestMatchingBuild.pollUntilCompleted().then(async (completedBuild) => {
      const commentAttributes = {
        ...commentAttributesFromPullRequest(pullRequest),
        ...commentAttributesFromBuild(completedBuild)
      }
      const body = attributesToCommentBody(commentAttributes)

      context.github.issues.createComment({ owner, repo, number, body })
    })
  })
}
