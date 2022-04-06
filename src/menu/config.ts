import { QuestionCollection } from "inquirer";

export enum HomeChoices {
  CloneKindredRepo = "Clone Kindred Repo",
  KafkaManagement = "Kafka Management",
  OtherCommands = "Other Commands"
}

export const HomeMenu: QuestionCollection[] = [
  {
    name: "home",
    message: "What would you like to do?",
    type: "list",
    choices: [
      HomeChoices.CloneKindredRepo,
      HomeChoices.KafkaManagement,
      HomeChoices.OtherCommands
    ]
  }
];
