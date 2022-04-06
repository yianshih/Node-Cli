import chalk from "chalk";

class Logger {
  info(msg: any) {
    console.log(chalk.blueBright(msg));
  }
  warning(msg: any) {
    console.log(chalk.yellowBright(msg));
  }
  error(msg: any) {
    console.log(chalk.redBright(msg));
  }
  success(msg: any) {
    console.log(chalk.greenBright(msg));
  }
}

const _logger = new Logger();

export const logger = _logger;
