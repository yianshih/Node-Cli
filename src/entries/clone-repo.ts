import { prompt, QuestionCollection } from "inquirer";
import { Repo, GetRepoGit } from "@cli/secret/repo";
import { logger } from "@cli/utils/logger";
import { exec } from "@cli/utils/exec";
import { hideLoading, showLoading } from "@cli/utils/loading";

export interface CloneRepoAnswer {
  repo: keyof typeof Repo;
  dir: string;
}

export const CloneRepoMenu: QuestionCollection<CloneRepoAnswer>[] = [
  {
    name: "repo",
    message: "Which repository would you like to clone ?",
    type: "list",
    choices: Object.values(Repo)
  },
  {
    name: "dir",
    message: "Which directory that repository would be cloned to ?",
    type: "input",
    default: "."
  }
];

const gitCloneCmd = (url: string, folder = "") => `git clone ${url} ${folder}`;

export const main = async () => {
  const answer = await prompt(CloneRepoMenu);
  const gitURL = GetRepoGit(answer.repo);

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
