const fetch = require('node-fetch').default

const headers = {
  'Travis-API-Version': '3',
  'Authorization': `token ${process.env['TRAVIS_TOKEN']}`
}

const travisBaseUrl = 'https://api.travis-ci.org'

const constructTravisUrl = path => `${travisBaseUrl}/${path}`

const escapeSlash = string => string.replace('/', '%2f')

const TravisClient = {
  getPullRequestBuilds: async (repo) => {
    const escapedString = escapeSlash(repo)

    const response = await fetch(
      constructTravisUrl(`repo/${escapedString}/builds?event_type=pull_request`),
      { headers }
    )

    return await response.json()
  },

  getLogs: async(jobId) => {
    const response = await fetch(
      constructTravisUrl(`job/${jobId}/log`),
      { headers }
    )

    return await response.json()
  }
}

module.exports = TravisClient;
