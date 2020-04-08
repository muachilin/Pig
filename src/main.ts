import * as core from '@actions/core'
import {context, GitHub} from '@actions/github'

async function run(): Promise<void> {
  try {
    
    const commitMessage = core.getInput('commit-comment')
  
    // Get GitHub token
    const githubToken = core.getInput('github-token')
    if (githubToken !== '') {
      // Create GitHub client
      const githubClient = new GitHub(githubToken)

      const commitCommentParams = {
        owner: context.repo.owner,
        repo: context.repo.repo,
        // eslint-disable-next-line @typescript-eslint/camelcase
        commit_sha: context.sha,
        body: commitMessage
      }
  
      try {
        await githubClient.repos.createCommitComment(commitCommentParams)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err, JSON.stringify(commitCommentParams, null, 2))
      }
      process.stdout.write(`before get label\n`)
      const Label = await githubClient.issues.getLabel({
        owner: context.repo.owner,
        repo: context.repo.repo,
        name: "in progress :octopus:"
      });
      process.stdout.write(`after get label\n`)
      if (Label === undefined) {
        await githubClient.issues.createLabel({
          owner: context.repo.owner,
          repo: context.repo.repo,
          name: "in progress :octopus:",
          description: "This issue is start being handling!",
          color: "f29513"
        });
      }
      // If it is a pull request
      if (context.issue.number !== undefined) {
        await githubClient.issues.createComment({
          // eslint-disable-next-line @typescript-eslint/camelcase
          issue_number: context.issue.number,
          owner: context.repo.owner,
          repo: context.repo.repo,
          body: commitMessage
        })

        const res = await githubClient.issues.get({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: context.issue.number
        });
        const leftParaIndex = res.data.title.indexOf('(');
        const rightParaIndex = res.data.title.indexOf(')');
        const linkIssueStr = res.data.title.substring(leftParaIndex + 2, rightParaIndex);
        process.stdout.write(`The parse issue number is:${linkIssueStr}\n`)
        const linkIssueNumber = +linkIssueStr;
        await githubClient.issues.addLabels({
          owner: context.repo.owner,
          repo: context.repo.repo,
          // eslint-disable-next-line @typescript-eslint/camelcase
          issue_number: linkIssueNumber,
          labels: ["in progress :octopus:"]
        })
      }
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()