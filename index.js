import { setFailed, getInput, setOutput } from '@actions/core';
import { getOctokit, context } from '@actions/github'

async function run() {
    try {
        const token = getInput('token');
        const octokit = getOctokit(token);

        const issues_and_prs = await octokit.paginate(octokit.rest.issues.listForRepo, {
            owner: context.repo.owner,
            repo: context.repo.repo,
            state: 'all',
          });

        const issue_stats = { open: 0, closed: 0 };
        const pull_request_stats = { open: 0, closed: 0, merged: 0 };

        for(const item of issues_and_prs){
            if('pull_request' in item){
                if (item.state == 'open') 
                        pull_request_stats.open++;
                else if (item.pull_request.merged_at == null) 
                        pull_request_stats.closed++;
                else 
                        pull_request_stats.merged++;
            }
            else {
                if (item.state == 'open') 
                    issue_stats.open++;
                else 
                    issue_stats.closed++;
            }
        }

        setOutput('issue_stats', issue_stats);
        setOutput('pull_request_stats', pull_request_stats);

    } catch(error) {
      setFailed(error.message);
    }
  }

run();