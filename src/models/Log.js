const { getLog } = require('../clients/travisClient')

class Log {
  // Logs don't have IDs of their own, so we need to fetch by job ID.
  static async getByJobId (jobId) {
    const rawLog = await getLog(jobId)

    return new this(rawLog)
  }

  // Very minimalistic implementation, but content is all we care about for now.
  constructor (rawLog) {
    this.content = rawLog.content
  }
}

module.exports = Log
