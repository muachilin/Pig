"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github_1 = require("@actions/github");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const commitMessage = core.getInput('commit-comment');
            // Get GitHub token
            const githubToken = core.getInput('github-token');
            if (githubToken !== '') {
                // Create GitHub client
                const githubClient = new github_1.GitHub(githubToken);
                const commitCommentParams = {
                    owner: github_1.context.repo.owner,
                    repo: github_1.context.repo.repo,
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    commit_sha: github_1.context.sha,
                    body: commitMessage
                };
                try {
                    yield githubClient.repos.createCommitComment(commitCommentParams);
                }
                catch (err) {
                    // eslint-disable-next-line no-console
                    console.error(err, JSON.stringify(commitCommentParams, null, 2));
                }
                // If it is a pull request
                if (github_1.context.issue.number !== undefined) {
                    yield githubClient.issues.createLabel({
                        owner: github_1.context.repo.owner,
                        repo: github_1.context.repo.repo,
                        name: "in progress :racehorse:",
                        //description: "This issue is start being handling!",
                        color: "f29513"
                    });
                    yield githubClient.issues.createComment({
                        // eslint-disable-next-line @typescript-eslint/camelcase
                        issue_number: github_1.context.issue.number,
                        owner: github_1.context.repo.owner,
                        repo: github_1.context.repo.repo,
                        body: commitMessage
                    });
                    /*await githubClient.issues.addLabels({
                      owner: context.repo.owner,
                      repo: context.repo.repo,
                      // eslint-disable-next-line @typescript-eslint/camelcase
                      issue_number: context.issue.number,
                      labels: ["in progress :racehorse:"]
                    })*/
                }
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
