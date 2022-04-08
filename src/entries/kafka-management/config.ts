import topics from "@cli/secret/kafka-topics.json";
export type KafkaTopicKey = keyof typeof topics;
export const KafkaTopicKeys = Object.keys(topics) as KafkaTopicKey[];
