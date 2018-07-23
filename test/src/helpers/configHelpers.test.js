const { shouldComment } = require('../../../src/helpers/configHelpers')

const constructBuild = (passed, failed, errored) => ({
  isPassed: () => passed,
  isFailed: () => failed,
  isErrored: () => errored
})

const constructConfig = (onPass, onFail, onError) => ({
  commentOnPass: onPass,
  commentOnFail: onFail,
  commentOnError: onError
})

describe('shouldComment', () => {
  it('should return false if there is no config', () => {
    expect(shouldComment(null, {})).toBe(false)
  })

  it('should return false if all the comment flags are false', () => {
    const config = constructConfig(false, false, false)
    const build = constructBuild(true, true, true)

    expect(shouldComment(config, build)).toBe(false)
  })

  it('should return true if the build passed and commentOnPass is set', () => {
    const config = constructConfig(true, false, false)
    const build = constructBuild(true, false, false)

    expect(shouldComment(config, build)).toBe(true)
  })
  it('should return true if the build failed and commentOnFail is set', () => {
    const config = constructConfig(false, true, false)
    const build = constructBuild(false, true, false)

    expect(shouldComment(config, build)).toBe(true)
  })
  it('should return true if the build errored and commentOnError is set', () => {
    const config = constructConfig(false, false, true)
    const build = constructBuild(false, false, true)

    expect(shouldComment(config, build)).toBe(true)
  })
})
