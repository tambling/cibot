# Cibot
> Demonstrated at [tambling/exponentiate](https://github.com/tambling/exponentiate/pulls)

## Purpose
A Probot plugin that listens for opened pull requests, then polls Travis CI and parses Jest test outcomes and NPM errors into easier-to-read comments.

## Care and Feeding
Cibot will only post on pull requests if you tell it to. It looks for a `.github/cibot.yml` config file, which should be structured like this: 
```
commentOnPass: true
commentOnFail: true
commentOnError: true
```
Any of the `true`s above can, of course, be `false`, which prevents Cibot from leaving comments in that particular outcome.

Cibot does have some limitations: it only works for Travis and Jest, and it only works on publicly-available repositories.

## Implementation
### Rationale
Extremely generally, the flow of information from repo to CI provider to Cibot comment looks something like this:
```
Repo ===> Pull Request ===> CI ===> Log ===> Cibot
```
Or, even more generally:
```
Event ===> Log ===> Comment
```
Getting from `Event` to `Log` and from `Log` to `Comment` are two semi-independent workflows, and each had some complexities and tradeoffs associated with them.

### Event to Log
Getting from the event to the log is easily the more complex of the two “halves” of Cibot. An ideal version of this workflow would build off of the `check_suite.completed` event, with tighter integration with the CI provider such that a link to the logs (or to a build, etc.) was made available. Since we are still in the early days of the `check_suite` API, the actual implementation is a bit more involved.

The flow to get the log for a completed build for a certain pull request (from Travis CI) is as follows:
1. Get builds.
2. Check builds for a build belonging to the pull request.
    2a. If there are no builds belonging to the pull request, poll the builds until there is.
3. Get the latest matching build
4. Check if the latest matching build is complete.
    4a. If the build isn’t complete, poll it until it is.
5. Get the job from the build.
6. Get the log from the job.

To help complete this flow, there are a few classes that abstract parts of the process.

#### `BuildCollection`
Represents a group of builds, as you would get from having queried for builds by repo name (as in Step 1). Exposes a few utility methods, such as `forPullRequest`, which abstracts the search in Step 2, `pollForPullRequest`, which handles Step 2a, and `latest`, which returns a `Build` and handles Step 3.

#### `Build`
Represents a single build, e.g. the latest matching build from Step 3. Handles the introspection in Step 4, the polling in 4a, and provides a `getLog` method that returns a `Log` to get us past Step 6.

#### `Log`
An extremely thin class that handles getting the proper log for a particular job ID (Step 6), and then holds onto its content so that its parent `Build` doesn’t have to worry about it.

### Log to Comment
Getting from the raw log to a comment on a pull request is much less involved:
1. Parse the relevant information out of the raw log.
2. Interpolate the relevant information into a comment body.
3. Use GitHub’s API to post the comment on the relevant PR.

Because there is a closer 1:1 correspondence between inputs and outputs for this half, most of its functionality is taken care of by modules that expose pure functions.

#### `jestParser`
Slightly inaccurately-named: contains a couple of methods that receive straight-from-the-terminal logs (with terminal color codes, etc.) and return the information the user cares about. Includes:
* `getFailures`, which matches for the `x` that Jest uses to denote test failures, returning an array of failed test titles.
* `getErrors`, which matches for `npm ERR!` and returns an array of error messages.
#### `commentHelpers`
Grabs information from the received `pull_request.opened` event and the matching `Build` to assemble the desired comment body. Given the outcome of a build (which can be `”passed”`, `”failed”`, or `”errored”`), passes the relevant data (and the `jestParse`ed logs) to a string interpolation method.
#### `github.issues.createComment`
Not actually implemented within Cibot, rather generously bestowed upon Cibot by its Probot progenitor. Given repository/pull request information and a comment body (created above), actually posts the comment.

## The Future
* Support for Circle CI, other CI providers.
* Support for Mocha, other test runners.
* Support for other languages (Cibot and Probot are Node/JavaScript, but the `Event => Log => Comment` flow is language-agnostic.
* `check_suite.completed` being fancy enough to receive webhook pushes on test suite completion, eliminating the need for polling and much of the `Event => Log` data model.