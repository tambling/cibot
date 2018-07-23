const {
  commentAttributesFromPullRequest,
  commentAttributesFromBuild,
  attributesToCommentBody
} = require('../../../../src/helpers/commentHelpers')

const jestParser = require('../../../../src/parsers/jestParser')
jest.mock('../../../../src/parsers/jestParser')

const {
  expectedPassed,
  expectedSingleFailure,
  expectedMultipleFailure,
  expectedShortError,
  expectedLongError,
  expectedNoError
} = require('./expectedComments')

describe('commentAttributesFromPullRequest', () => {
  it('returns the right attributes from the pull request object', () => {
    const rawAttributes = {
      user: { login: 'user' },
      head: { sha: '12345' }
    }

    const expectedParsedAttributes = {
      audience: 'user',
      sha: '12345'
    }

    const actualParsedAttributes = commentAttributesFromPullRequest(rawAttributes)

    expect(actualParsedAttributes).toEqual(expectedParsedAttributes)
  })
})

describe('commentAttributesFromBuild', () => {
  it('returns the right attributes from the build object', async () => {
    const stubbedBuild = {
      state: 'passed',
      webLink: 'http://foo.bar',
      getLog: () => Promise.resolve({ content: 'Here is a log' })
    }

    const expectedParsedAttributes = {
      outcome: 'passed',
      link: 'http://foo.bar',
      log: 'Here is a log'
    }

    const actualParsedAttributes = await commentAttributesFromBuild(stubbedBuild)

    expect(actualParsedAttributes).toEqual(expectedParsedAttributes)
  })
})

describe('attributesToCommentBody', () => {
  const staticAttributes = {
    audience: 'user',
    sha: '12345',
    link: 'http://foo.bar'
  }

  it('assembles the right comment for passed tests', () => {
    const actualComment = attributesToCommentBody({
      ...staticAttributes,
      outcome: 'passed'
    })

    expect(actualComment).toEqual(expectedPassed)
  })

  it('assembles the right comment for a single failed test', () => {
    jestParser.getFailures.mockReturnValue([ 'Single failure' ])

    const actualComment = attributesToCommentBody({
      ...staticAttributes,
      outcome: 'failed'
    })

    expect(actualComment).toEqual(expectedSingleFailure)
  })

  it('assembles the right comment for multiple failed tests', () => {
    jestParser.getFailures.mockReturnValue([
      'First failure',
      'Second failure'
    ])

    const actualComment = attributesToCommentBody({
      ...staticAttributes,
      outcome: 'failed'
    })

    expect(actualComment).toEqual(expectedMultipleFailure)
  })

  it('assembles the right comment for a long error', () => {
    jestParser.getErrors.mockReturnValue([
      'Error line 1',
      'Error line 2',
      null, null, null, null
    ])

    const actualComment = attributesToCommentBody({
      ...staticAttributes,
      outcome: 'errored'
    })

    expect(actualComment).toEqual(expectedLongError)
  })

  it('assembles the right comment for a short error', () => {
    jestParser.getErrors.mockReturnValue([
      'Error line 1',
      'Error line 2',
      'Error line 3'
    ])

    const actualComment = attributesToCommentBody({
      ...staticAttributes,
      outcome: 'errored'
    })

    expect(actualComment).toEqual(expectedShortError)
  })

  it('assembles the right comment for no error message', () => {
    jestParser.getErrors.mockReturnValue([])

    const actualComment = attributesToCommentBody({
      ...staticAttributes,
      outcome: 'errored'
    })

    expect(actualComment).toEqual(expectedNoError)
  })
})
