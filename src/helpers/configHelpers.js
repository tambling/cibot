const configHelpers = {
  shouldComment: (config, build) => {
    if (!config) {
      return false
    }

    const { commentOnPassed, commentOnFailed, commentOnErrored } = config

    return (commentOnPassed && build.isPassed()) ||
      (commentOnFailed && build.isFailed()) ||
      (commentOnErrored && build.isErrored())
  }
}

module.exports = configHelpers
