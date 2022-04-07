import { exec } from "@cli/utils/exec";
import { logger } from "@cli/utils/logger";
import { prompt, QuestionCollection } from "inquirer";

interface KillPortAnswer {
  port: string;
}
interface KillPIDAnswer {
  pid: string;
}

const GetPortMenu: QuestionCollection<KillPortAnswer>[] = [
  {
    name: "port",
    message: "What port you would like to kill ?",
    type: "input"
  }
];

const GetPIDMenu: QuestionCollection<KillPIDAnswer>[] = [
  {
    name: "pid",
    message: "Which PID you would like to kill ?",
    type: "input"
  }
];

export const main = async () => {
  const answer = await prompt(GetPortMenu);
  const { port } = answer;
  if (port === "" || !Number.isInteger(Number(port))) {
    logger.error(`Invalid Port ${port},please enter a number`);
    main();
    return;
  }
  exec(`lsof -i tcp:${port}`)(
    async (o) => {
      logger.info(o);
      const { pid } = await prompt(GetPIDMenu);
    },
    (e, o) => {
      if (!o) logger.info(`Port ${port} is not in use`);
      else logger.error(e);
      main();
    }
  );
};
