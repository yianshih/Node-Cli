import { prompt, QuestionCollection } from "inquirer";
import { main as MirrorTopic } from "@cli/entries/kafka-management/mirror";
import { main as ResetTopic } from "@cli/entries/kafka-management/reset";
import { logger } from "@cli/utils/logger";

enum KafkaAction {
  Mirror = "Mirror",
  Reset = "Reset"
}

type ActionType = keyof typeof KafkaAction;

interface KafkaActionAnswer {
  action: ActionType;
}

const AnswerAction: Record<ActionType, () => Promise<void>> = {
  [KafkaAction.Mirror]: MirrorTopic,
  [KafkaAction.Reset]: ResetTopic
};

const KafkaActionMenu: QuestionCollection<KafkaActionAnswer>[] = [
  {
    name: "action",
    message: "Which Kafka action would you like to process ?",
    type: "list",
    choices: Object.keys(KafkaAction)
  }
];

export const main = async () => {
  const { action } = await prompt(KafkaActionMenu);
  const actionFnc = AnswerAction?.[action];
  if (!Boolean(actionFnc)) return logger.error("Cannot find action");
  actionFnc();
};
