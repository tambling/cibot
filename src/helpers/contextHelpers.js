const contextHelpers = {
  processPayload: (payload) => ({
    pullRequest: payload.pull_request,
    owner: payload.pull_request.base.repo.owner.login,
    repo: payload.pull_request.base.repo.name,
    number: payload.pull_request.number,
    action: payload.action
  })
}

module.exports = contextHelpers
