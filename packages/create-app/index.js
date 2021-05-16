import { generate } from "ncgen";
import program from "commander";
import updateNotifier from "update-notifier";

import ncgenConfig from "./app-ncgen-config";
import pkg from "./package.json";

export function main(args) {

  checkVersion()

  program.version(pkg.version, "-V, --version").usage("<command>");

  // subcommands
  Object.keys(ncgenConfig.sub).forEach(subcommand => {
    program
      .command(subcommand)
      .description(ncgenConfig.sub[subcommand].description)
      .action(async () => {
        await generate(ncgenConfig, { type: "s", command: subcommand });
      });
  });

  // main command
  program.action(async () => {
    await generate(ncgenConfig, { type: "m" });
  });

  program.parse(args);
}

function checkVersion() {
  const notifier = updateNotifier({ pkg, updateCheckInterval: 0 });

  if (notifier.update) {
    notifier.notify();
  }
}
