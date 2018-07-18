/**
 * This is the entry point for your Probot App.
 * @param {import('probot').Application} app - Probot's Application class.
 */

module.exports = app => {
  app.on('pull_request', async context => {
    const pullRequest = context.payload.pull_request
    const baseRepo = pullRequest.base.repo.full_name
    const pullRequestNumber = pullRequest.number
    
    // get all repo PR builds
    // filter builds by PR number
    // get most recent
    // get job
    // 
    // poll job logs until it's complete
    // when it's complete:
    //   parse it if it's a failure
    //   pass it whole if it's an error
    //   set a flag if it passes
    //
    // put together a comment with the parsed output
    // send the comment up to GitHub
  })
}
