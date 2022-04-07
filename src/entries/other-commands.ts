import { hideLoading, showLoading } from "@cli/utils/loading";
import { logger } from "@cli/utils/logger";

export const main = async () => {
  logger.info("Coming soon");
  showLoading();
  await new Promise((resolve) => {
    setTimeout(() => resolve("Success"), 1000);
  });
  hideLoading();
  logger.success(`Cloned successfully`);
};
