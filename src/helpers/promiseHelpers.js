// This is a fun one. It's factored out from Build#pollUntilComplete and
// BuildCollection#pollForPullRequest. Given the three functions initiate,
// getCandidate, and getCandidate, it initiates a polling loop where it runs
// initiate(), then gets and checks the data that is being polled for. If it
// doesn't find it, it gives up after maxTries.
const promiseHelpers = {
  pollPromise: ({
    initiate,
    getCandidate,
    checkCandidate,
    wait = 20000,
    maxTries = 100
  }) => (
    new Promise((resolve, reject) => {
      let tries = 0
      const poll = async () => {
        await initiate()
        tries += 1

        const currentCandidate = getCandidate()
        if (checkCandidate(currentCandidate)) {
          resolve(currentCandidate)
        } else if (tries >= maxTries) {
          reject(new Error('Maximum number of tries exceeded'))
        } else {
          setTimeout(poll, wait)
        }
      }

      poll()
    })
  )
}

module.exports = promiseHelpers
