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

  async updateAttributes() {
    const rawLog = await get(this.href)

    this.content = rawLog.content
    this.complete = rawLog.log_parts.some(log_part => log_part.final)
  }

  waitUntilComplete() {
    return new Promise((resolve, reject) => {
      const updateAndCheckCompleteness = () => {
        console.log('Updating and checking completeness')
        this.updateAttributes().then(() => {
          if (this.complete) {
            resolve(this);
          } else {
            setTimeout(updateAndCheckCompleteness, 20000);
          }
        })
      }

      updateAndCheckCompleteness();
    })
  }  
}

module.exports = Log;
