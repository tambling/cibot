const { pollPromise } = require('../../../src/helpers/promiseHelpers')

describe('pollPromise', () => {
  const initiate = () => new Promise((resolve) => resolve())

  it('resolves with a value it checkCandidate returns true', async () => {
    const getCandidate = () => 'Resolved'
    const checkCandidate = () => true

    const result = await pollPromise({initiate, getCandidate, checkCandidate})

    expect(result).toEqual('Resolved')
  })

  it('rejects if it exceeds the maximum tries', () => {
    const getCandidate = () => false
    const checkCandidate = () => false
    const maxTries = 1
    const wait = 0

    pollPromise({initiate, getCandidate, checkCandidate, maxTries, wait})
      .catch((err) => {
        expect(err).toEqual(new Error('Maximum number of tries exceeded'))
      })
  })
  it('sets a timeout and tries again', () => {
    const getCandidate = () => 'Resolved'
    const checkCandidate = jest.fn().mockReturnValueOnce(false).mockReturnValue(true)
    const maxTries = 2
    const wait = 0

    pollPromise({initiate, getCandidate, checkCandidate, maxTries, wait})
      .then((result) => {
        expect(result).toBe('Resolved')
        expect(checkCandidate).toHaveBeenCalledTimes(2)
      })
  })
})
