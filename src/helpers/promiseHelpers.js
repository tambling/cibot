const promiseHelpers = {
  pollPromise: ({
    initiate,
    checkCandidate,
    getCandidate,
    wait = 20000,
    maxTries = 100
  }) => (
    new Promise((resolve, reject) => {
      let tries = 0
      const poll = () => {
        initiate().then(() => {
          tries += 1

          const currentCandidate = getCandidate()
          if (checkCandidate(currentCandidate)) {
            resolve(currentCandidate)
          } else if (tries >= maxTries) {
            reject(new Error('Maximum number of tries exceeded'))
          } else {
            setTimeout(poll, wait)
          }
        })
      }

      poll()
    })
  )
}

module.exports = promiseHelpers
