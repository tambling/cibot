const { processPayload } = require('../../../src/helpers/contextHelpers')

describe('processPayload', () => {
  it('gives the right attributes given the payload', () => {
    const stubbedPullRequest = {
      base: {
        repo: {
          name: 'repo',
          owner: { login: 'user' }
        }
      },
      number: 1
    }

    const stubbedPayload = {
      pull_request: stubbedPullRequest,
      action: 'opened'
    }

    const expectedProcessedPayload = {
      pullRequest: stubbedPullRequest,
      owner: 'user',
      repo: 'repo',
      number: 1,
      action: 'opened'
    }

    expect(processPayload(stubbedPayload)).toEqual(expectedProcessedPayload)
  })
})
