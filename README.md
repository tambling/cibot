# cibot

> A GitHub App built with [Probot](https://github.com/probot/probot) that A Probot app that comments with the outcome of a CI build

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Contributing

If you have suggestions for how cibot could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2018 Dean Tambling <dean@tambling.me> (http://tambling.me)

## TODO
- [ ] Get builds on pull request creation
- [ ] BuildCollection (with `findByPullRequestNumber`)
- [ ] Build (with `getJobLog`)
- [ ] Log (with `pollUntilComplete`)
- [ ] Parse log when it's complete
- [ ] Format parsed log into proper message
- [ ] Send proper message as a comment on the PR
- [ ] Clean/refactor code
- [ ] Test everything
- [ ] Add process description to README
