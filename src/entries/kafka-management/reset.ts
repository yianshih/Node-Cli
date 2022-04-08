import { exec } from "@cli/utils/exec";
import { logger } from "@cli/utils/logger";
import { prompt, QuestionCollection } from "inquirer";
import { KafkaTopicKeys } from "./config";

interface TopicAnswer {
  topics: string[];
  date: string;
}

const TopicMenu: QuestionCollection<TopicAnswer>[] = [
  {
    name: "topics",
    message: "Which topics you would like to reset ?",
    type: "checkbox",
    choices: [...new Set(KafkaTopicKeys)],
    pageSize: 20
  },
  {
    name: "date",
    message: "Which date would you like to reset ?",
    type: "input"
  }
];

const ResetCmd = (topics: string[], date: string) =>
  `docker compose exec -e KAFKA_ENV="int" -e 
  KAFKA_GROUP_ID="kafka-mirror-consumer-local-$(whoami)" 
  kafka /opt/infra/kafka-utils.sh 
  "reset-consumer-group-topics-offset" 
  "${date}"`;

export const main = async () => {
  const { topics, date } = await prompt(TopicMenu);
  console.log({ cmd: ResetCmd(topics, new Date(date).toISOString()) });
};
