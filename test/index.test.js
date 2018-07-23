const cibot = require('..')
const { Application, Context } = require('probot')

const fetch = require('node-fetch')
jest.mock('node-fetch')
const fetchFixture = require('./helpers/fetchFixture')
fetch.mockImplementation(fetchFixture)

describe('cibot', () => {
  let app
  let github

  beforeEach(() => {
    github = {
      issues: {
        createComment: jest.fn()
      }
    }

    Context.prototype.config = () => ({})

    app = new Application()
    app.auth = () => Promise.resolve(github)
    app.load(cibot)

    app.log = jest.fn()
    app.log.child = () => ({
      info: jest.fn(),
      error: jest.fn()
    })
  })

  afterEach(() => {
    github.issues.createComment.mockClear()
    app.log.mockClear()
  })

  it('creates a comment when configured to comment on a passing build', async () => {
    Context.prototype.config = () => ({
      commentOnPass: true
    })

    const payload = require('./fixtures/inputs/github/pull_request_with_pass')

    await app.receive({event: 'pull_request.opened', payload})

    const { passComment } = require('./fixtures/outputs')

    expect(github.issues.createComment).toBeCalledWith(passComment)
  })

  it('creates a comment when configured to comment on a failing build', async () => {
    Context.prototype.config = () => ({
      commentOnFail: true
    })

    const payload = require('./fixtures/inputs/github/pull_request_with_fail')

    await app.receive({event: 'pull_request.opened', payload})

    const { failComment } = require('./fixtures/outputs')

    expect(github.issues.createComment).toBeCalledWith(failComment)
  })

  it('creates a comment when configured to comment on an erroring build', async () => {
    Context.prototype.config = () => ({
      commentOnError: true
    })

    const payload = require('./fixtures/inputs/github/pull_request_with_error')

    await app.receive({event: 'pull_request.opened', payload})

    const { errorComment } = require('./fixtures/outputs')

    expect(github.issues.createComment).toBeCalledWith(errorComment)
  })

  it('logs when not configured to comment on a passing build', async () => {
    const payload = require('./fixtures/inputs/github/pull_request_with_pass')

    await app.receive({event: 'pull_request.opened', payload})

    const { passLog } = require('./fixtures/outputs')

    expect(app.log).toBeCalledWith(passLog)
  })

  it('logs when not configured to comment on a failing build', async () => {
    const payload = require('./fixtures/inputs/github/pull_request_with_fail')

    await app.receive({event: 'pull_request.opened', payload})

    const { failLog } = require('./fixtures/outputs')

    expect(app.log).toBeCalledWith(failLog)
  })

  it('logs when not configured to comment on an erroring build', async () => {
    const payload = require('./fixtures/inputs/github/pull_request_with_error')

    await app.receive({event: 'pull_request.opened', payload})

    const { errorLog } = require('./fixtures/outputs')

    expect(app.log).toBeCalledWith(errorLog)
  })
})
