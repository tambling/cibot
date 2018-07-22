const { getLog } = require('../clients/travisClient')

class Log {
  static async getByJobId (jobId) {
    const rawLog = await getLog(jobId)

    return new this(rawLog)
  }

  constructor (rawLog) {
    this.content = rawLog.content
  }
}

module.exports = Log
