import { splitStdout, trimMultiSpaces } from "@cli/utils";
import { exec } from "@cli/utils/exec";
import { hideLoading, showLoading } from "@cli/utils/loading";
import { logger } from "@cli/utils/logger";
import { prompt, QuestionCollection } from "inquirer";

const GET_REMOTE_BRANCHES_COMMAND = `git branch -a`;

interface DeleteBranchAnswer {
  branches: string[];
}

interface ConfirmDeleteAnswer {
  confirm: boolean;
}

const DeleteBranchMenu = (
  choices: string[]
): QuestionCollection<DeleteBranchAnswer>[] => [
  {
    name: "branches",
    message:
      "Which branches you would like to delete (master will not be listed) ?",
    type: "checkbox",
    choices: [...new Set(choices)],
    pageSize: 20
  }
];

const confirmDeleteMenu: QuestionCollection<ConfirmDeleteAnswer>[] = [
  {
    name: "confirm",
    message: "Are you sure to delete these branches ?",
    type: "confirm"
  }
];

const DeleteBranchCmd = (branches: string[]) =>
  `git push -d origin ${branches.map(trimMultiSpaces).join(" ")}`;

const deleteBranch = async (options: string[]) => {
  if (!options.length) return logger.error("No valid branches to delete");
  const { branches } = await prompt(DeleteBranchMenu(options));
  if (!branches.length) {
    logger.warning("Please select branches");
    deleteBranch(options);
    return;
  }
  logger.warning(branches.map((b, i) => `${i + 1}.${b}`).join("\n"));
  const { confirm } = await prompt(confirmDeleteMenu);
  if (!confirm) return;
  showLoading();
  exec(DeleteBranchCmd(branches))(
    () => {
      hideLoading();
      logger.success("Delete branches successfully");
    },
    (e) => {
      hideLoading();
      logger.error(e);
    }
  );
};

export const main = async () => {
  await exec(GET_REMOTE_BRANCHES_COMMAND)(
    (o) => {
      deleteBranch(
        splitStdout(JSON.stringify(o), {
          splitBy: "\\n",
          parse: (branch) =>
            branch.replace("remotes/origin/", "").replace('"', ""),
          filter: (branch) =>
            Boolean(branch) &&
            !branch.includes("master") &&
            !branch.includes("main") &&
            !branch.includes("HEAD") &&
            !branch.includes("*")
        })
      );
    },
    (e) => logger.error(e)
  );
};
