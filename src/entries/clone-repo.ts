import { prompt, QuestionCollection } from "inquirer";
import repo from "@cli/secret/repo.json";
import { logger } from "@cli/utils/logger";
import { exec } from "@cli/utils/exec";
import { hideLoading, showLoading } from "@cli/utils/loading";

/**
 * repo.json should be in the following structure
{
  <repo name>:<repo clone url>
}
 */
type RepoKey = keyof typeof repo;

const repoKeys = Object.keys(repo) as RepoKey[];

interface CloneRepoAnswer {
  repo: RepoKey;
  dir: string;
}

export const CloneRepoMenu: QuestionCollection<CloneRepoAnswer>[] = [
  {
    name: "repo",
    message: "Which repository would you like to clone ?",
    type: "list",
    choices: repoKeys
  },
  {
    name: "dir",
    message: "Which directory that repository would be cloned to ?",
    type: "input",
    default: "."
  }
];

const getRepoGit = (key: RepoKey): string | undefined => repo?.[key];

const gitCloneCmd = (url: string, folder = "") => `git clone ${url} ${folder}`;

export const main = async () => {
  const answer = await prompt(CloneRepoMenu);
  const gitURL = getRepoGit(answer.repo);

  if (!gitURL) return logger.error("error: cannot find git repository url");

  logger.info(`Cloning ${answer.repo} to ${answer.dir}`);
  showLoading();
  const cloneExec = exec(gitCloneCmd(gitURL, answer.dir));
  cloneExec(
    () => {
      hideLoading();
      logger.success(`Cloned successfully`);
    },
    (e) => {
      hideLoading();
      logger.error(e);
      return main();
    }
  );
};
