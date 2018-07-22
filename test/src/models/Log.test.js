const Log = require('../../../src/models/Log')

const { getLog } = require('../../../src/clients/travisClient')
jest.mock('../../../src/clients/travisClient')

describe('Log', () => {
  describe('getByJobId', () => {
    it('calls getLog with the right jobId and creates a Log', async () => {
      getLog.mockResolvedValue({content: 'Log'})

      const log = await Log.getByJobId(1)

      expect(getLog).toBeCalledWith(1)
      expect(log.content).toBe('Log')
    })
  })
})
