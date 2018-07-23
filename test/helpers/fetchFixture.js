const travisFixtures = require('../fixtures/inputs/travis')
const getHref = (url) => {
  const pathMatch = url.match(/https:\/\/api.travis-ci.com(.*)/)

  if (pathMatch) {
    return pathMatch[1]
  }

  return null
}

const fetchFixture = (url) => {
  const path = getHref(url)

  const matchingFixture = travisFixtures.find(fixture => fixture['@href'] === path)

  if (matchingFixture) {
    return Promise.resolve({ json: () => Promise.resolve(matchingFixture) })
  }

  throw new Error(`fetchFixture doesn't know how to handle ${path}!`)
}

module.exports = fetchFixture
