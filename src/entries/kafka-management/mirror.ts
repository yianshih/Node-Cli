import { exec } from "@cli/utils/exec";
import { logger } from "@cli/utils/logger";
import { prompt, QuestionCollection } from "inquirer";
import { KafkaTopicKeys } from "./config";

interface TopicAnswer {
  topics: string[];
}

const TopicMenu: QuestionCollection<TopicAnswer>[] = [
  {
    name: "topics",
    message: "Which topics you would like to mirror ?",
    type: "checkbox",
    choices: [...new Set(KafkaTopicKeys)],
    pageSize: 20
  }
];

const MirroCmdPrefix = `docker compose exec -e KAFKA_ENV="int" -e KAFKA_GROUP_ID="kafka-mirror-consumer-local-$(whoami)" kafka /opt/infra/kafka-utils.sh "mirror"`;

const MirroCmd = (topics: string[]) =>
  `${MirroCmdPrefix} "${topics.join(",")}"`;

export const main = async () => {
  const { topics } = await prompt(TopicMenu);
  exec(MirroCmd(topics))(
    (o) => {
      //
    },
    (e) => logger.error(e)
  );
};
