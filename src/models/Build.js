const { get } = require('../clients/TravisClient');
const Log = require('./Log');

class Build {
  constructor(rawBuild) {
    this.pullRequestNumber = rawBuild.pull_request_number
    this.startedAt = new Date(rawBuild.started_at)
    this.jobIds = rawBuild.jobs.map(job => job.id) 
    this.state = rawBuild.state
    this.href = rawBuild['@href'].slice(1)
  }

  async getCurrentState() {
    const rawBuild = await get(this.href)

    console.log(rawBuild)
    this.state = rawBuild.state
  }

  isPassed() {
    return this.state === 'passed';
  }

  isFailed() {
    return this.state === 'failed';
  }

  isErrored() {
    return this.state === 'errored';
  }

  isComplete() {
    return this.isPassed() || this.isFailed() || this.isErrored()
  }

  getLog() {
    if (this.jobIds.length) {
      return Log.getByJobId(this.jobIds[0])
    } 

    return null
  }

  waitUntilDone() {
    return new Promise((resolve, reject) => {
      const updateAndCheckCompleteness = () => {
        console.log('Updating and checking completeness')
        this.getCurrentState().then(() => {
          if (this.isComplete()) {
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

module.exports = Build;

