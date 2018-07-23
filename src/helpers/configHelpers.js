const configHelpers = {
  // Given the config (received from Probot) and the Build object, determine
  // whether a comment POST is authorized/required.
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
