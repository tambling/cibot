const Build = require('../../../src/models/Build')

const { get } = require('../../../src/clients/travisClient')
jest.mock('../../../src/clients/travisClient')

const Log = require('../../../src/models/Log')
jest.mock('../../../src/models/Log')

const { pollPromise } = require('../../../src/helpers/promiseHelpers')
jest.mock('../../../src/helpers/promiseHelpers')

describe('Build', () => {
      const rawAttributes = {
        id: 1,
        pull_request_number: 2,
        started_at: '2000-01-01',
        jobs: [{id: 3}],
        state: 'started',
        '@href': '/build/1',
        repository: { slug: 'user/repo' }
      }
  describe('constructor', () => {
    it('creates a Build with the right properties', () => {
      const newBuild = new Build(rawAttributes)

      expect(newBuild.pullRequestNumber).toEqual(2)
      expect(newBuild.startedAt).toEqual(new Date('2000-01-01'))
      expect(newBuild.jobIds).toEqual([3])
      expect(newBuild.state).toEqual('started')
      expect(newBuild.href).toEqual('build/1')
      expect(newBuild.webLink).toEqual('https://www.travis-ci.com/user/repo/builds/1')
    })
  })

  describe('updateState', () => {
    it('should fetch the latest state of the build', () => {
      get.mockResolvedValue({state: 'passed'})

      const build = new Build(rawAttributes)

      build.updateState().then(() => {
        expect(build.state).toBe('passed')
        expect(get.mock.calls[0][0]).toBe('build/1')
      })
    })
  })

  describe('isPassed', () => {
    it('should return true if the state is passed', () => {
      const build = new Build({...rawAttributes, state: 'passed'})

      expect(build.isPassed()).toBe(true)
    })
  })

  describe('isFailed', () => {
    it('should return true if the state is failed', () => {
      const build = new Build({...rawAttributes, state: 'failed'})

      expect(build.isFailed()).toBe(true)
    })
  })

  describe('isErrored', () => {
    it('should return true if the state is errored', () => {
      const build = new Build({...rawAttributes, state: 'errored'})

      expect(build.isErrored()).toBe(true)
    })
  })

  describe('isComplete', () => {
    it('is true if the build is passed, failed, or errored', () => {
    const passedBuild = new Build({...rawAttributes, state: 'passed'})
    const failedBuild = new Build({...rawAttributes, state: 'failed'})
    const erroredBuild = new Build({...rawAttributes, state: 'errored'})

    const allCompleted = [passedBuild, failedBuild, erroredBuild]
      .map(build => build.isComplete())
      .every(value => value) 

    expect(allCompleted).toBe(true)
    })

    it('is false if the build is started', () => {
    const startedBuild = new Build(rawAttributes)
      expect(startedBuild.isComplete()).toBe(false)
      
    })
  })

  describe('getLog', () => {
    it('should call Log.getByJobId with the build job', async () => {
      Log.getByJobId.mockResolvedValue({content: 'Hi'})

      const build = new Build(rawAttributes)
      const log = await build.getLog()

      expect(Log.getByJobId.mock.calls[0][0]).toBe(3)
      expect(log.content).toEqual('Hi')
    })

    it('should return null if there are no jobs', () => {
      const build = new Build({...rawAttributes, jobs: []})

      expect(build.getLog()).toBe(null)
    })
  })

  describe('pollUntilCompleted', () => {
    it('should call pollPromise with the right arguments', () => {
      const build = new Build(rawAttributes) 
      build.updateState = jest.fn()
      build.isComplete = jest.fn()

      build.pollUntilCompleted()

      const args = pollPromise.mock.calls[0][0]

      expect(args.getCandidate()).toBe(build)

      args.initiate()
      expect(build.updateState).toBeCalled()

      args.checkCandidate(build)
      expect(build.isComplete).toBeCalled()
    })
  })
})
