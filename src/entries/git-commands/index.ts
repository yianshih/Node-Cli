import { prompt, QuestionCollection } from "inquirer";
import { main as DeleteRemoteBranch } from "@cli/entries/git-commands/delete-remote-branch";
import { logger } from "@cli/utils/logger";

enum Commands {
  DeleteRemoteBranch = "DeleteRemoteBranch"
}

type CommandType = keyof typeof Commands;

interface GitCommandsAnswer {
  command: CommandType;
}

const AnswerAction: Record<CommandType, () => Promise<void>> = {
  [Commands.DeleteRemoteBranch]: DeleteRemoteBranch
};

const GitCommandsMenu: QuestionCollection<GitCommandsAnswer>[] = [
  {
    name: "command",
    message: "Which action would you like to process ?",
    type: "list",
    choices: Object.keys(Commands)
  }
];

export const main = async () => {
  const { command } = await prompt(GitCommandsMenu);
  const action = AnswerAction?.[command];
  if (!Boolean(action)) return logger.error("Cannot find action");
  action();
};
