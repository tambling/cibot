const { get } = require('../clients/TravisClient');
const Log = require('./Log');

const constructWebLink = ({slug, id}) => 
  `https://www.travis-ci.com/${slug}/builds/${id}`

class Build {
  constructor(attributes) {
    this.pullRequestNumber = attributes.pull_request_number
    this.startedAt = new Date(attributes.started_at)
    this.jobIds = attributes.jobs.map(job => job.id) 
    this.state = attributes.state
    this.href = attributes['@href'].slice(1)

    this.webLink = constructWebLink({ 
      slug: attributes.repository.slug,
      id: attributes.id
    })
  }

  async updateState() {
    const attributes = await get(this.href)

    this.state = attributes.state
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

  pollUntilCompleted() {
    return pollPromise({
      initiate: () => this.getCurrentState(),
      getCandidate: () => this,
      checkCandidate: (candidate) => candidate.isComplete();
      wait: 20000
    })
  }  
}

module.exports = Build;

