import _debug from "debug";
import chalk from "chalk";
import _ from "lodash";

const debugLog = _debug("ncgen");

export function debug(...args) {
  debugLog.apply(null, args);
}

export const log = {
  info(msg) {
    console.log(chalk.white(msg));
  },
  warn(msg) {
    console.log(chalk.yellow(msg));
  },
  error(msg) {
    console.log(chalk.red(msg));
  },
  success(msg) {
    console.log(chalk.green(msg));
  },
};
