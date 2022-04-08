import { exec } from "@cli/utils/exec";
import { logger } from "@cli/utils/logger";
import { parseTableOutputToObject } from "@cli/utils/parsers";
import { prompt, QuestionCollection } from "inquirer";

interface Lsof {
  COMMAND: string;
  PID: string;
  USER: string;
  FD: string;
  TYPE: string;
  DEVICE: string;
  "SIZE/OFF": string;
  NODE: string;
  NAME: string;
}

interface KillPortAnswer {
  port: string;
}
interface KillPIDAnswer {
  pids: string[];
}

const GetPortMenu: QuestionCollection<KillPortAnswer>[] = [
  {
    name: "port",
    message: "What port you would like to kill ?",
    type: "input"
  }
];

const GetPIDMenu = (choices: string[]): QuestionCollection<KillPIDAnswer>[] => [
  {
    name: "pids",
    message: "Which PID you would like to kill ?",
    type: "checkbox",
    choices: [...new Set(choices)]
  }
];

const defaultLsof: Lsof = {
  COMMAND: "",
  PID: "",
  USER: "",
  FD: "",
  TYPE: "",
  DEVICE: "",
  "SIZE/OFF": "",
  NODE: "",
  NAME: ""
};

const parsedLosfLine = (data: string): string[] => {
  const values = data.split(" ");
  const content = values.slice(0, 8);
  // Name may contain space
  const name = values.slice(8);
  return [...content, name.join(" ")];
};

const getLsofCommand = (port: string) => `lsof -i tcp:${port}`;
const getKillCommand = (pids: string[]) => `kill ${pids.join(" ")}`;

const killPid = async (data: Lsof[]) => {
  const { pids = [] } = await prompt(GetPIDMenu(data.map((d) => d.PID)));
  if (!pids.length) {
    logger.warning("Please select PID to kill");
    killPid(data);
    return;
  }
  exec(getKillCommand(pids))(
    (o) => {
      logger.info(o);
    },
    (e) => {
      logger.error(e);
    }
  );
};

export const main = async () => {
  const answer = await prompt(GetPortMenu);
  const { port } = answer;
  if (port === "" || !Number.isInteger(Number(port))) {
    logger.error(`Invalid Port ${port},please enter a number`);
    main();
    return;
  }
  exec(getLsofCommand(port))(
    async (o) => {
      const data = parseTableOutputToObject(o, defaultLsof, parsedLosfLine);
      logger.info(o);
      await killPid(data);
    },
    (e, o) => {
      if (!o) logger.info(`Port ${port} is not in use`);
      else logger.error(e);
      main();
    }
  );
};
