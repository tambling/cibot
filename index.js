const BuildCollection = require('./src/models/BuildCollection')

const { shouldComment } = require('./src/helpers/configHelpers')
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
  app.on('pull_request.opened', async (context) => {
    const config = await context.config('cibot.yml')

    const {
      pullRequest,
      owner,
      repo,
      number
    } = processPayload(context.payload)

    const repoSlug = `${owner}/${repo}`

    const repoBuilds = await BuildCollection.getByRepoSlug(repoSlug)
    const matchingBuilds = await repoBuilds.pollForPullRequest(number)
    const latestMatchingBuild = matchingBuilds.latest()

    latestMatchingBuild.pollUntilCompleted().then(async (completedBuild) => {
      const commentAttributes = {
        ...commentAttributesFromPullRequest(pullRequest),
        ...(await commentAttributesFromBuild(completedBuild))
      }

      const body = attributesToCommentBody(commentAttributes)

      if (shouldComment(config, completedBuild)) {
        context.github.issues.createComment({ owner, repo, number, body })
      } else {
        app.log(`Dry run for ${owner}/${repo}#${number}: \n${body}`)
      }
    })
  })
}
