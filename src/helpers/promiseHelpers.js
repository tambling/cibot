const promiseHelpers = {
  pollPromise: ({initiate, checkCandidate, getCandidate, wait}) => (
    new Promise((resolve, reject) => {
      const poll = () => {
        initiate().then(() => {
          const currentCandidate = getCandidate()
          if (checkCandidate(currentCandidate)) {
            resolve(currentCandidate)
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
