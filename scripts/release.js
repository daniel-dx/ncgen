const fs = require("fs-extra");
const path = require("path");
const execa = require("execa");

const toReadmePath = path.resolve("./packages/ncgen/README.md");

fs.copyFileSync("README.md", toReadmePath);

execa.commandSync("npm publish", {
  cwd: path.resolve("./packages/ncgen"),
});

fs.removeSync(toReadmePath);
