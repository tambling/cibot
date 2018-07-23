const { getFailures, getErrors } = require('../../../../src/parsers/jestParser')
const { failLog, errorLog } = require('./logExcerpts')

describe('jestParser', () => {
  describe('getFailures', () => {
    it('parses failures out of a raw log', () => {
      expect(getFailures(failLog)).toEqual(['returns 1 when the power is 0 (13ms)'])
    })
  })

  describe('getErrors', () => {
    it('parses errors out of a raw log', () => {
      expect(getErrors(errorLog)).toEqual(['404 Not Found: fake-package-that-doesnt-exist@^0.0.1'])
    })
  })
})
