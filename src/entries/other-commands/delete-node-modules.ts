import { exec } from "@cli/utils/exec";
import { hideLoading, showLoading } from "@cli/utils/loading";
import { logger } from "@cli/utils/logger";
import { prompt, QuestionCollection } from "inquirer";

interface DeleteNodeModulesAnswer {
  confirm: boolean;
}

const DeleteNodeModulesMenu: QuestionCollection<DeleteNodeModulesAnswer>[] = [
  {
    name: "confirm",
    message: "Are you sure to delete these node_modules ?",
    type: "confirm"
  }
];

export const main = async () => {
  exec(`find . -type d -name node_modules -prune`)(
    async (o) => {
      if (!o) return logger.error("node_modules not found");
      logger.error(o);
      const answer = await prompt(DeleteNodeModulesMenu);
      const { confirm } = answer;
      if (!confirm) return;
      showLoading();
      exec(`find . -type d -name node_modules -prune -exec rm -rf {} \\;`)(
        () => {
          hideLoading();
          logger.success("Delete Successfully");
        }
      );
    },
    (e) => logger.error(e)
  );
};
