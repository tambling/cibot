const BuildCollection = require('../../../src/models/BuildCollection')

const { get, getRepoBuilds } = require('../../../src/clients/travisClient')
jest.mock('../../../src/clients/travisClient')

const { pollPromise } = require('../../../src/helpers/promiseHelpers')
jest.mock('../../../src/helpers/promiseHelpers')

const rawBuildAttributes = {
  id: 1,
  started_at: '2000-01-01',
  jobs: [{id: 3}],
  state: 'started',
  '@href': '/build/1',
  repository: { slug: 'user/repo' }
}

describe('BuildCollection', () => {
  describe('getByRepoSlug', () => {
    beforeEach(() => {
      getRepoBuilds.mockResolvedValue({
        '@href': '/repo/user%2frepo/builds',
        builds: [
          {...rawBuildAttributes, id: 1},
          {...rawBuildAttributes, id: 2}
        ]
      })
    })

    afterEach(() => {
      getRepoBuilds.mockReset()
    })

    it('calls getRepoBuilds with the slug', () => {
      BuildCollection.getByRepoSlug('user/repo').then(() => {
        expect(getRepoBuilds.mock.calls[0][0]).toBe('user/repo')
      })
    })

    it('creates a new BuildCollection with the right properties', () => {
      BuildCollection.getByRepoSlug('user/repo').then((collection) => {
        expect(collection.href).toBe('repo/user%2frepo/builds')
        expect(collection.builds.length).toBe(2)
      })
    })
  })

  describe('updateBuilds', () => {
    beforeEach(() => {
      get.mockResolvedValue({ builds: [
        {...rawBuildAttributes, id: 1},
        {...rawBuildAttributes, id: 2},
        {...rawBuildAttributes, id: 3}
      ]})
    })
    it('fetches the href of the BuildCollection', () => {
      const buildCollection = new BuildCollection({
        href: 'build/collection',
        builds: []
      })

      buildCollection.updateBuilds()

      expect(get.mock.calls[0][0]).toBe('build/collection')
    })

    it('warns if the BuildCollection is a subset', () => {
      global.console = { warn: jest.fn() }

      const buildCollection = new BuildCollection({
        builds: [],
        href: '',
        subset: true
      })

      buildCollection.updateBuilds()

      expect(global.console.warn).toBeCalled()
    })

    it('sets the builds of the BuildCollection', () => {
      const buildCollection = new BuildCollection({
        builds: [],
        href: ''
      })

      buildCollection.updateBuilds().then(() => {
        expect(buildCollection.builds.length).toBe(3)
      })
    })
  })

  describe('forPullRequest', () => {
    it('returns a BuildCollection of the matching Builds', () => {
      const buildCollection = new BuildCollection({
        href: '',
        builds: [
          {...rawBuildAttributes, pull_request_number: 1},
          {...rawBuildAttributes, pull_request_number: 1},
          {...rawBuildAttributes, pull_request_number: 2}
        ]
      })

      const filteredBuildCollection = buildCollection.forPullRequest(1)

      expect(filteredBuildCollection.builds.length).toBe(2)
    })
  })

  describe('latest', () => {
    it('returns the latest single Build', () => {
      const buildCollection = new BuildCollection({
        href: '',
        builds: [
          {...rawBuildAttributes, started_at: '2018-01-01'},
          {...rawBuildAttributes, started_at: '2018-07-01'},
          {...rawBuildAttributes, started_at: '2018-03-01'}
        ]
      })

      const latestBuild = buildCollection.latest()

      expect(latestBuild.startedAt).toEqual(new Date('2018-07-01'))
    })
  })

  describe('pollForPullRequest', () => {
    it('passes the right arguments to pollPromise', () => {
      const buildCollection = new BuildCollection({
        href: '',
        builds: [
          {...rawBuildAttributes, pull_request_number: 1},
          {...rawBuildAttributes, pull_request_number: 1},
          {...rawBuildAttributes, pull_request_number: 2}
        ]
      })
      buildCollection.updateBuilds = jest.fn()
      buildCollection.forPullRequest = jest.fn()

      buildCollection.pollForPullRequest(1)

      const args = pollPromise.mock.calls[0][0]

      args.initiate()
      expect(buildCollection.updateBuilds).toBeCalled()

      args.getCandidate()
      expect(buildCollection.forPullRequest).toBeCalledWith(1)

      expect(args.checkCandidate(buildCollection)).toBe(3)
    })
  })
})
