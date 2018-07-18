const { getRepoBuilds } = require('../clients/TravisClient');
const Build = require('./Build');

class BuildCollection {
  static async fetchByRepoName(repoName) {
    const rawBuilds = await getRepoBuilds(repoName);

    return new this(rawBuilds.builds)
  }

  constructor(rawBuilds) {
    this.builds = rawBuilds.map(rawBuild => 
      rawBuild.constructor === Build ? rawBuild : new Build(rawBuild)
    )
  }

  forPullRequest(pullRequestNumber) {
    const matchingBuilds = this.builds.filter(build => 
      build.pullRequestNumber === pullRequestNumber
    )

    return new this.constructor(matchingBuilds)
  }

  latest() {
    const buildsSortedByDate = this.builds.sort((a, b) => 
      b.startedAt - a.startedAt
    )

    return buildsSortedByDate[0]
  }
}

module.exports = BuildCollection;
