const configHelpers = {
  shouldComment: (config, build) => {
    if (!config) {
      return false
    }

    const { commentOnPass, commentOnFail, commentOnError } = config

    return (commentOnPass && build.isPassed()) ||
      (commentOnFail && build.isFailed()) ||
      (commentOnError && build.isErrored())
  }
}

module.exports = configHelpers
