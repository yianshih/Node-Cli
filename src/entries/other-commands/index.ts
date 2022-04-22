import { logger } from "@cli/utils/logger";
import { prompt, QuestionCollection } from "inquirer";
import { main as killPort } from "@cli/entries/other-commands/kill-port";
import { main as DeleteNodeModules } from "@cli/entries/other-commands/delete-node-modules";

enum Commands {
  KillPorts = "KillPorts",
  DeleteNodeModules = "DeleteNodeModules"
}

type CommandType = keyof typeof Commands;

interface OtherCommandsAnswer {
  commands: CommandType;
}

const OtherCommandsMenu: QuestionCollection<OtherCommandsAnswer>[] = [
  {
    name: "commands",
    message: "Which action would you like to process ?",
    type: "list",
    choices: Object.keys(Commands)
  }
];

const AnswerAction: Record<CommandType, () => Promise<void>> = {
  [Commands.KillPorts]: killPort,
  [Commands.DeleteNodeModules]: DeleteNodeModules
};

export const main = async () => {
  const answer = await prompt(OtherCommandsMenu);
  const action = AnswerAction?.[answer.commands];
  if (!Boolean(action)) return logger.error("Cannot find action");
  action();
};
