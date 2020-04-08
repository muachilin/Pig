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
      
      // If it is a pull request
      if (context.issue.number !== undefined) {
        await githubClient.issues.createLabel({
          owner: context.repo.owner,
          repo: context.repo.repo,
          name: "in progress :racehorse:",
          color: "f29513"
        });
        
        await githubClient.issues.createComment({
          // eslint-disable-next-line @typescript-eslint/camelcase
          issue_number: context.issue.number,
          owner: context.repo.owner,
          repo: context.repo.repo,
          body: commitMessage
        })
        
        /*await githubClient.issues.addLabels({
          owner: context.repo.owner,
          repo: context.repo.repo,
          // eslint-disable-next-line @typescript-eslint/camelcase
          issue_number: context.issue.number,
          labels: ["in progress :racehorse:"]
        })*/
      }
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()