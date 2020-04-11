const core = require('@actions/core');
const { context, GitHub } = require("@actions/github");

function isNumber(n) {
  return !isNaN(parseFloat(n)) && !isNaN(n - 0)
}

async function run() {
  try {
    const githubToken = core.getInput('github-token')
    const progressLabelWord = core.getInput('in-progress-label-word')
    const progressLabelColor = core.getInput('in-progress-label-color')
    const doneLabelWord = core.getInput('done-label-word')
    const doneLabelColor = core.getInput('done-label-color')
    if (githubToken !== '') {
      const githubClient = new GitHub(githubToken)
      if (context.issue.number !== undefined) {
        const res = await githubClient.issues.get({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: context.issue.number
        });
        const leftParaIndex = res.data.title.indexOf('(');
        const rightParaIndex = res.data.title.indexOf(')');
        const linkIssueStr = res.data.title.substring(leftParaIndex + 2, rightParaIndex);
        const linkIssueNumber = +linkIssueStr;
        const labelsInRepoResponse = await githubClient.issues.listLabelsForRepo({
          owner: context.repo.owner,
          repo: context.repo.repo
        });
        const isMerged = (context.payload.action === 'closed') && (context.payload.pull_request['merged'] === true);
        if (isMerged && isNumber(linkIssueNumber)) {
          const issueLabelsResponse = await githubClient.issues.listLabelsOnIssue({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: linkIssueNumber
          });
          const issueLabel = issueLabelsResponse.data.find(l => l.name === progressLabelWord);
          if (issueLabel !== undefined) {
            await githubClient.issues.removeLabel({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: linkIssueNumber,
              name: progressLabelWord
            });
          }
          const doneLabel = labelsInRepoResponse.data.find(l => l.name === doneLabelWord);
          if (doneLabel === undefined) {
            await githubClient.issues.createLabel({
              owner: context.repo.owner,
              repo: context.repo.repo,
              name: doneLabelWord,
              description: "This issue is solved",
              color: doneLabelColor
            });
          }
          await githubClient.issues.addLabels({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: linkIssueNumber,
            labels: [doneLabelWord]
          })
          return;
        }
        if (!isNumber(linkIssueNumber)) {
          await githubClient.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: "❗ Please include the number of corresponding issue in the pull request title!\n 💠 For example: Pull request title (#123)\n\n\n 🐷 This comment is auto-generated by pig-action\n"
          })
          return;
        }
        const progressLabel = labelsInRepoResponse.data.find(l => l.name === progressLabelWord);
        if (progressLabel === undefined) {
          await githubClient.issues.createLabel({
            owner: context.repo.owner,
            repo: context.repo.repo,
            name: progressLabelWord,
            description: "This issue is currently being handling",
            color: progressLabelColor
          });
        }
        process.stdout.write(`The linked issue of this pull request is issue#${linkIssueNumber}\n`)
        const listOfCommentsResponse = await githubClient.issues.listComments({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: linkIssueNumber
        });
        const comment = listOfCommentsResponse.data.find(l => l.body === `💡 This issue is linked to the pull request #${context.issue.number}\n 🔧 The related pull request is opened by @${res.data.user.login}\n\n\n 🐷 This comment is auto-generated by pig-action\n`);
        if (comment === undefined) {
          await githubClient.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: linkIssueNumber,
            body: `💡 This issue is linked to the pull request #${context.issue.number}\n 🔧 The related pull request is opened by @${res.data.user.login}\n\n\n 🐷 This comment is auto-generated by pig-action\n`,
          });
        }
        await githubClient.issues.addLabels({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: linkIssueNumber,
          labels: [progressLabelWord]
        })
      }
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()