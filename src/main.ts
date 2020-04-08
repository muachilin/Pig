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

      const labelsInRepoResponse = await githubClient.issues.listLabelsForRepo({
        owner: context.repo.owner,
        repo: context.repo.repo
      });

      const Label = labelsInRepoResponse.data.find(l => l.name === "in progress :octopus:");
      if (Label === undefined) {
        await githubClient.issues.createLabel({
          owner: context.repo.owner,
          repo: context.repo.repo,
          name: "in progress :octopus:",
          description: "This issue is start being handling!",
          color: "a9ffd4"
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
          // eslint-disable-next-line @typescript-eslint/camelcase
          issue_number: context.issue.number
        });
        const leftParaIndex = res.data.title.indexOf('(');
        const rightParaIndex = res.data.title.indexOf(')');
        const linkIssueStr = res.data.title.substring(leftParaIndex + 2, rightParaIndex);
        process.stdout.write(`The linked issue of this pull request is #${linkIssueStr}\n`)
        const linkIssueNumber = +linkIssueStr;

        const listOfCommentsResponse = await githubClient.issues.listComments({
          owner: context.repo.owner,
          repo: context.repo.repo,
          // eslint-disable-next-line @typescript-eslint/camelcase
          issue_number: linkIssueNumber
        });
        const comment = listOfCommentsResponse.data.find(l => l.body === `This issue is linked to the pull request #${context.issue.number}\n`);
        if (comment === undefined) {
          await githubClient.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            // eslint-disable-next-line @typescript-eslint/camelcase
            issue_number: linkIssueNumber,
            body: `This issue is linked to the pull request #${context.issue.number}\n`,
          });
        }
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