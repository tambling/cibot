const stripTerminalCharacters = string =>
  string
    .replace(/\u001b\[[0-9;]*m/g, '')

const jestFailureRegEx = /✕ (.+)( \(\d+ms\))?/
const nodeErrorRegEx = /npm ERR! (.*)/

const JestParser = {
  getFailures: (log) => (
    stripTerminalCharacters(log)
    .split('\r\n')
    .filter(line => line.match(jestFailureRegEx))
    .map(line => line.match(jestFailureRegEx)[1])
  ),
  getErrors: (log) => {
    const logLines = stripTerminalCharacters(log)
      .split('\r\n')

    const errorLines = logLines
      .filter(line => line.match(nodeErrorRegEx))

    return errorLines.map(line => line.match(nodeErrorRegEx)[1])
  }
}

module.exports = JestParser
