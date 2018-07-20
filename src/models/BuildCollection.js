const { get, getRepoBuilds } = require('../clients/TravisClient');
const Build = require('./Build');

class BuildCollection {
  static async getByRepoSlug(slug) {
    const attributes = await getRepoBuilds(slug);

    const { builds } = attributes;
    const href = attributes['@href'].slice(1)

    return new this({href, builds})
  }

  constructor({href, subset: false, builds}) {
    this.href = href;
    this.subset = subset
    this.setBuilds(builds)
  }

  setBuilds(newBuilds) {
    this.builds = newBuilds.map(rawBuild => 
      rawBuild.constructor === Build ? rawBuild : new Build(rawBuild)
    )
  }

  async updateBuilds() {
    if (this.subset) {
      console.warn("BuildCollection calling fetchBuilds with an href that points to its superset!");
    }

    const attributes = await get(this.href)
    this.setBuilds(attributes.builds);
  }

  forPullRequest(pullRequestNumber) {
    const matchingBuilds = this.builds.filter(build => 
      build.pullRequestNumber === pullRequestNumber
    )

    return new this.constructor({
      ...this, 
      builds: matchingBuilds, 
      subset: true
    });
  }

  latest() {
    return builds.reduce((previous, current) => 
      previous.startedAt > current.startedAt ? previous : current
    )
  }

  pollForPullRequest(pullRequestNumber) {
    return pollPromise({
      initiate: () => this.updateBuilds(),
      getCandidate: () => this.forPullRequest(pullRequestNumber),
      checkCandidate: (candidate) => candidate.builds.length
      wait: 20000
    });
  }
}

module.exports = BuildCollection;
