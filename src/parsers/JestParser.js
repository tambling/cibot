const stripTerminalCharacters = string => 
  string
    .replace(/\u001b\[\d+m/g, '')
    .replace('\r', '')

const jestRegEx = /✕ (.+) \(\d+ms\)/

