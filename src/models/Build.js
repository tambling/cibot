const Log = require('./Log');

class Build {
  constructor(rawBuild) {
    this.pullRequestNumber = rawBuild.pull_request_number
    this.startedAt = new Date(rawBuild.started_at)
    this.jobIds = rawBuild.jobs.map(job => job.id) 
  }

  getLog() {
    if (this.jobIds.length) {
      return Log.getByJobId(this.jobIds[0])
    } 

    return null
  }

}

module.exports = Build;

