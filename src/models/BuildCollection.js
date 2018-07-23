const Build = require('./Build')

const { get, getRepoBuilds } = require('../clients/travisClient')

const { pollPromise } = require('../helpers/promiseHelpers')

class BuildCollection {
  // Gets raw builds by repo slug, then returns a BuildCollection with those
  // builds parsed into Build objects.
  static async getByRepoSlug (slug) {
    const attributes = await getRepoBuilds(slug)

    const { builds } = attributes
    const href = attributes['@href'].slice(1)

    return new this({href, builds})
  }

  // Because getByRepoSlug pre-chews this data a bit, this constructor doesn't
  // have much to do.
  constructor ({href, subset = false, builds}) {
    this.href = href
    this.subset = subset
    this.setBuilds(builds)
  }

  // We need BuildCollection#builds to be an array of Builds. This casts raw
  // build attributes into Builds as needed.
  setBuilds (newBuilds) {
    this.builds = newBuilds.map(rawBuild =>
      rawBuild.constructor === Build ? rawBuild : new Build(rawBuild)
    )
  }

  // Re-fetches this BuildCollection's raw attributes and re-sets its builds.
  // Useful for checking if a new build has been created for a repo. Note that
  // if you've used forPullRequest, this can behave erratically.
  async updateBuilds () {
    if (this.subset) {
      console.warn('BuildCollection calling fetchBuilds with an href that points to its superset!')
    }

    const attributes = await get(this.href)
    this.setBuilds(attributes.builds)
  }

  // Returns a new BuildCollection just containing builds for a certain pull
  // request (denoted by number).
  forPullRequest (pullRequestNumber) {
    const matchingBuilds = this.builds.filter(build =>
      build.pullRequestNumber === pullRequestNumber
    )

    return new this.constructor({
      ...this,
      builds: matchingBuilds,
      subset: true
    })
  }

  // Returns the Build with the latest startedAt property.
  latest () {
    return this.builds.reduce((previous, current) =>
      previous.startedAt > current.startedAt ? previous : current
    )
  }

  // Initiates a loop where we look for a build matching the pull request
  // number, then continually fetch and set the builds until we find it. Useful
  // to try again if a pull request is too new to have a build when the
  // 'pull_request.opened' event fires.
  pollForPullRequest (pullRequestNumber) {
    return pollPromise({
      initiate: () => this.updateBuilds(),
      getCandidate: () => this.forPullRequest(pullRequestNumber),
      checkCandidate: (candidate) => candidate.builds.length
    })
  }
}

module.exports = BuildCollection
