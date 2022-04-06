import { prompt, QuestionCollection } from "inquirer";
import { main as cloneRepo } from "@cli/entries/clone-repo";
import { main as gitCommands } from "@cli/entries/git-commands";
import { main as kafkaManagement } from "@cli/entries/kafka-management";
import { main as otherCommands } from "@cli/entries/other-commands";
import { logger } from "@cli/utils/logger";

export enum HomeChoices {
  CloneRepo = "Clone Repo",
  KafkaManagement = "Kafka Management",
  GitCommands = "Git Commands",
  OtherCommands = "Other Commands"
}

export interface HomeAnswer {
  home: HomeChoices;
}

export const HomeMenu: QuestionCollection<HomeAnswer>[] = [
  {
    name: "home",
    message: "What would you like to do?",
    type: "list",
    choices: [
      HomeChoices.CloneRepo,
      HomeChoices.KafkaManagement,
      HomeChoices.GitCommands,
      HomeChoices.OtherCommands
    ]
  }
];

const EntryHandler: Record<HomeChoices, () => Promise<void>> = {
  [HomeChoices.CloneRepo]: cloneRepo,
  [HomeChoices.KafkaManagement]: kafkaManagement,
  [HomeChoices.GitCommands]: gitCommands,
  [HomeChoices.OtherCommands]: otherCommands
};

export const main = async () => {
  const answer = await prompt(HomeMenu);
  const entry = EntryHandler?.[answer.home];
  if (!entry) return logger.error("Unknown entry");
  entry();
};
