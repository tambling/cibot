const { pollPromise } = require('../../../src/helpers/promiseHelpers')

describe('pollPromise', () => {
  const initiate = () => Promise.resolve()

  it('resolves with a value it checkCandidate returns true', async () => {
    const getCandidate = () => 'Resolved'
    const checkCandidate = () => true
    const wait = 0

    const result = await pollPromise({initiate, getCandidate, checkCandidate, wait})

    expect(result).toEqual('Resolved')
  })

  it('rejects if it exceeds the maximum tries', () => {
    const getCandidate = () => false
    const checkCandidate = () => false
    const maxTries = 1
    const wait = 0

    pollPromise({initiate, getCandidate, checkCandidate, maxTries, wait})
      .catch(err => expect(err).toEqual(new Error('Maximum number of tries exceeded')))
  })

  it('sets a timeout and tries again', async () => {
    const getCandidate = () => 'Resolved'
    const checkCandidate = jest.fn()
      .mockReturnValueOnce(false)
      .mockReturnValue(true)
    const maxTries = 2
    const wait = 0

    const result = await pollPromise({initiate, getCandidate, checkCandidate, maxTries, wait})

    expect(result).toBe('Resolved')
    expect(checkCandidate).toHaveBeenCalledTimes(2)
  })
})
