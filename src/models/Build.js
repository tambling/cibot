const Log = require('./Log')

const { get } = require('../clients/travisClient')

const { pollPromise } = require('../helpers/promiseHelpers')

const constructWebLink = ({slug, id}) =>
  `https://www.travis-ci.com/${slug}/builds/${id}`

class Build {
  // Set properties based on the raw build object fetched from Travis (usually
  // as part of a collection of builds — see travisClient.getRepoBuilds)
  constructor (attributes) {
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

  // Fetch this build's attributes from Travis, then update its state.
  async updateState () {
    const attributes = await get(this.href)

    this.state = attributes.state
  }

  isPassed () {
    return this.state === 'passed'
  }

  isFailed () {
    return this.state === 'failed'
  }

  isErrored () {
    return this.state === 'errored'
  }

  // A build will be either 'started', 'passed,' 'failed,' or 'errored.' If it's
  // any of the latter three, we know it's completed, rather than 'started'
  isComplete () {
    return this.isPassed() || this.isFailed() || this.isErrored()
  }

  // Most builds only have one job, and Travis allows for log fetching by job
  // ID. Log.getByJobId does what it says on the tin.
  getLog () {
    if (this.jobIds.length) {
      return Log.getByJobId(this.jobIds[0])
    }

    return null
  }

  // Initiate a polling loop in which we fetch the build's state, then check if
  // it's complete. This is used in the main event handler, so that we only grab
  // the log when the build is complete (and therefore the log is meaningful).
  pollUntilCompleted () {
    return pollPromise({
      initiate: () => this.updateState(),
      getCandidate: () => this,
      checkCandidate: (candidate) => candidate.isComplete()
    })
  }
}

module.exports = Build
