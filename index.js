const fetch = require('node-fetch').default

/**
 * This is the entry point for your Probot App.
 * @param {import('probot').Application} app - Probot's Application class.
 */
module.exports = app => {
  app.on('pull_request', async context => {
    app.log(context);
  })
}
