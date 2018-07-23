process.env['TRAVIS_TOKEN'] = 'hello'

const fetch = require('node-fetch')
jest.mock('node-fetch')
const travisClient = require('../../../src/clients/travisClient')

const mockedJsonParse = jest.fn().mockResolvedValue({foo: 'bar'})
fetch.mockResolvedValue({ json: mockedJsonParse })

describe('travisClient', () => {
  afterEach(() => fetch.mockClear())

  describe('get', () => {
    it('fetches the path passed in', () => {
      travisClient.get('this/path')

      const expectedUrl = 'https://api.travis-ci.com/this/path'

      expect(fetch.mock.calls[0][0]).toEqual(expectedUrl)
    })

    it('sets the headers properly', () => {
      const expectedHeaders = {
        'Travis-API-Version': '3',
        'Authorization': 'token hello'
      }

      travisClient.get('this/path')

      expect(fetch.mock.calls[0][1]).toEqual({ headers: expectedHeaders })
    })
    it('returns the parsed JSON', async () => {
      const actualReturn = await travisClient.get('this/path')

      expect(actualReturn).toEqual({foo: 'bar'})
    })
  })

  describe('getRepoBuilds', () => {
    it('fetches the builds for the proper repo', () => {
      travisClient.getRepoBuilds('user/repo')

      const expectedUrl = 'https://api.travis-ci.com/repo/user%2frepo/builds'

      expect(fetch.mock.calls[0][0]).toEqual(expectedUrl)
    })

    it('sets the headers properly', () => {
      const expectedHeaders = {
        'Travis-API-Version': '3',
        'Authorization': 'token hello'
      }

      travisClient.getRepoBuilds('user/repo')

      expect(fetch.mock.calls[0][1]).toEqual({ headers: expectedHeaders })
    })

    it('returns the parsed JSON', async () => {
      const actualReturn = await travisClient.getRepoBuilds('user/repo')

      expect(actualReturn).toEqual({foo: 'bar'})
    })
  })

  describe('getLog', () => {
    it('fetches the logs for the proper job', () => {
      travisClient.getLog(1)

      const expectedUrl = 'https://api.travis-ci.com/job/1/log'

      expect(fetch.mock.calls[0][0]).toEqual(expectedUrl)
    })

    it('sets the headers properly', () => {
      const expectedHeaders = {
        'Travis-API-Version': '3',
        'Authorization': 'token hello'
      }

      travisClient.getLog(1)

      expect(fetch.mock.calls[0][1]).toEqual({ headers: expectedHeaders })
    })

    it('returns the parsed JSON', async () => {
      const actualReturn = await travisClient.getLog(1)

      expect(actualReturn).toEqual({foo: 'bar'})
    })
  })
})
