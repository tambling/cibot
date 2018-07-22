module.exports = {
  expectedPassed: `
Hi @user, your commit at 12345 passed all of its tests!

For more details, you can see the whole build log <a href="http://foo.bar" target="_blank">here</a>.
`,
  expectedSingleFailure: `
Hi @user, your commit at 12345 failed a test: 
<ul>
<li><code>Single failure</code></li>
</ul> 
For more details, you can see the whole build log <a href="http://foo.bar" target="_blank">here</a>.
`,
  expectedMultipleFailure: `
Hi @user, your commit at 12345 failed some tests: 
<ul>
<li><code>First failure</code></li>
<li><code>Second failure</code></li>
</ul> 
For more details, you can see the whole build log <a href="http://foo.bar" target="_blank">here</a>.
`,
  expectedLongError: `
Hi @user, the CI build for your commit at 12345 had an error. The error message began with: 
<pre>Error line 1
Error line 2</pre>
For more details, you can see the whole build log <a href="http://foo.bar" target="_blank">here</a>.
`,
  expectedShortError: `
Hi @user, the CI build for your commit at 12345 had an error. The error message was: 
<pre>Error line 1
Error line 2
Error line 3</pre>
For more details, you can see the whole build log <a href="http://foo.bar" target="_blank">here</a>.
`,
  expectedNoError: `
Hi @user, the CI build for your commit at 12345 had an error.
<br />
For more details, you can see the whole build log <a href="http://foo.bar" target="_blank">here</a>.
`


}
