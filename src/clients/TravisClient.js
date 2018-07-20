const fetch = require('node-fetch').default

const headers = {
  'Travis-API-Version': '3',
  'Authorization': `token ${process.env['TRAVIS_TOKEN']}`
}

const travisBaseUrl = 'https://api.travis-ci.com'

const constructTravisUrl = path => `${travisBaseUrl}/${path}`

const escapeSlash = string => string.replace('/', '%2f')

const TravisClient = {
  get: async (path) => {
    const response = await fetch(
      constructTravisUrl(path),
      { headers }
    )

    return response.json()
  },

  getRepoBuilds: async (repo) => {
    const escapedString = escapeSlash(repo)

    const response = await fetch(
      constructTravisUrl(`repo/${escapedString}/builds`),
      { headers }
    )

    return response.json()
  },

  getLog: async(jobId) => {
    const response = await fetch(
      constructTravisUrl(`job/${jobId}/log`),
      { headers }
    )

    return response.json()
  }
}

module.exports = TravisClient
