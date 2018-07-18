const { get, getLog } = require('../clients/TravisClient');

class Log {
  static async getByJobId(jobId) {
    const rawLog = await getLog(jobId)

    return new this(rawLog)
  }

  constructor(rawLog) {
    this.href = rawLog['@href'].slice(1)
    this.content = rawLog.content
    this.complete = rawLog.log_parts.some(log_part => log_part.final)
  }
}

module.exports = Log;
