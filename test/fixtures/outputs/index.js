module.exports = {
  passComment: {
    owner: 'tambling',
    repo: 'exponentiate',
    number: 1,
    body: '\nHi @tambling, your commit at 279015e3f648f562845667f1db90a431101d4e42 passed all of its tests!\n\nFor more details, you can see the whole build log <a href="https://www.travis-ci.com/tambling/exponentiate/builds/79650349" target="_blank">here</a>.\n'
  },
  failComment: {
    owner: 'tambling',
    repo: 'exponentiate',
    number: 2,
    body: '\nHi @tambling, your commit at d34464ba9fa760cf9cac5f141e30d45bc3e038b6 failed a test: \n<ul>\n<li><code>returns 1 when the power is 0 (13ms)</code></li>\n</ul> \nFor more details, you can see the whole build log <a href="https://www.travis-ci.com/tambling/exponentiate/builds/79650367" target="_blank">here</a>.\n'
  },
  errorComment: {
    owner: 'tambling',
    repo: 'exponentiate',
    number: 3,
    body: '\nHi @tambling, the CI build for your commit at c82d96b6adbde804000e991c0c2d4aa779222cd1 had an error. The error message began with: \n<pre>code E404\n404 Not Found: fake-package-that-doesnt-exist@^0.0.1</pre>\nFor more details, you can see the whole build log <a href="https://www.travis-ci.com/tambling/exponentiate/builds/79650414" target="_blank">here</a>.\n'
  },
  passLog: `Dry run for tambling/exponentiate#1:

Hi @tambling, your commit at 279015e3f648f562845667f1db90a431101d4e42 passed all of its tests!

For more details, you can see the whole build log <a href="https://www.travis-ci.com/tambling/exponentiate/builds/79650349" target="_blank">here</a>.
`,
  failLog: `Dry run for tambling/exponentiate#2:

Hi @tambling, your commit at d34464ba9fa760cf9cac5f141e30d45bc3e038b6 failed a test: 
<ul>
<li><code>returns 1 when the power is 0 (13ms)</code></li>
</ul> 
For more details, you can see the whole build log <a href="https://www.travis-ci.com/tambling/exponentiate/builds/79650367" target="_blank">here</a>.
`,
  errorLog: `Dry run for tambling/exponentiate#3:

Hi @tambling, the CI build for your commit at c82d96b6adbde804000e991c0c2d4aa779222cd1 had an error. The error message began with: 
<pre>code E404
404 Not Found: fake-package-that-doesnt-exist@^0.0.1</pre>
For more details, you can see the whole build log <a href="https://www.travis-ci.com/tambling/exponentiate/builds/79650414" target="_blank">here</a>.
`
}
