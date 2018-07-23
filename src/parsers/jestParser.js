const stripTerminalCharacters = string =>
  string
    .replace(/\u001b\[[0-9;]*m/g, '')

// Matches e.g. "✕ Function returns true (10ms)"
const jestFailureRegEx = /✕ (.+)( \(\d+ms\))?/

// Matches e.g. "npm ERR! Package not found: fake-package"
const nodeErrorRegEx = /npm ERR! (.*)/

// For each terminal-formatted line, strip away all the terminal characters,
// break on newlines, and check for/return matches of the specified regex.
const parseLines = (body, regex) =>
    stripTerminalCharacters(body)
    .split('\r\n')
    .filter(line => line.match(regex))
    .map(line => line.match(regex)[1])

const jestParser = {
  getFailures: (log) => parseLines(log, jestFailureRegEx),
  getErrors: (log) => parseLines(log, nodeErrorRegEx)
}

module.exports = jestParser
