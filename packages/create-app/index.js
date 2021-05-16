import { generate } from "ncgen";
import program from "commander";

import ncgenConfig from "./app-ncgen-config";
import pkg from "./package.json";

export function main(args) {
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
