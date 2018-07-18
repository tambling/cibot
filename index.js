const BuildCollection = require('./src/models/BuildCollection')

/**
 * This is the entry point for your Probot App.
 * @param {import('probot').Application} app - Probot's Application class.
 */

module.exports = app => {
  app.on('pull_request', async context => {
    const pullRequest = context.payload.pull_request
    const baseRepoName = pullRequest.base.repo.full_name
    const pullRequestNumber = pullRequest.number
    
    // get all repo PR builds
    const repoBuilds = await BuildCollection.fetchByRepoName(baseRepoName)
    // filter builds by PR number
    const pullRequestBuilds = repoBuilds.forPullRequest(pullRequestNumber)
    // get most recent
    const latestPullRequestBuild = pullRequestBuilds.latest()

    // get job
    const buildLog = await latestPullRequestBuild.getLog()

    // // poll job logs until it's complete
    buildLog.waitUntilComplete().then(log => app.log(log))
    // when it's complete:
    //   parse it if it's a failure
    //   pass it whole if it's an error
    //   set a flag if it passes
    //
    // put together a comment with the parsed output
    // send the comment up to GitHub
  })
}
