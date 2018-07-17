const fetch = require('node-fetch').default

const headers = {
  'Travis-API-Version': '3',
  'Authorization': `token ${process.env['TRAVIS_TOKEN']}`
}

const travisBaseUrl = 'https://api.travis-ci.org'

const constructTravisUrl = path => `${travisBaseUrl}/${path}`

const escapeSlash = string => string.replace('/', '%2f')

const unTerminalString = string => 
  string
    .replace(/\u001b/g, '')
    .replace(/\[31m/g, '')
    .replace(/\[39m/g, '')
    .replace(/\[2m/g, '')
    .replace(/\[22m/g, '')
    .replace('\r', '')
const jestRegEx = /✕ (.+) \(\d+ms\)/


const TravisClient = {
  getBuilds: async (repo) => {
    const escapedString = escapeSlash(repo)

    const response = await fetch(
      constructTravisUrl(`repo/${escapedString}/builds`),
      { headers }
    )

    const json = await response.json()
    console.log(json)
    console.log(json.builds[0].jobs[0])
  },

  getLogs: async(jobId) => {
    const response = await fetch(
      constructTravisUrl(`job/${jobId}/log`),
      { headers }
    )

    const json = await response.json()

    lines = json.content.split('\n').filter(line => line.includes('✕'))

    console.log(lines.map(line => unTerminalString(line).match(jestRegEx)[1]))


  }
}

module.exports = TravisClient;
