import degit from "degit";
import inquirer from "inquirer";
import program from "commander";
import path from "path";
import glob from "glob";
import fs from "fs-extra";
import del from "del";
import _ from "lodash";
import axios from "axios";
import os from "os";
import md5 from "md5";

import { debug, log } from "./utils";
import pkg from "../package.json";

const ncgenHome = path.resolve(os.homedir(), ".ncgen");

let _answers = {
  projectName: "",
};

function getProjectRootPath() {
  return path.resolve(".", _answers.projectName);
}

function cloneResource(tmplSource, isTemp = false) {
  return new Promise((resolve) => {
    const emitter = degit(tmplSource, {
      cache: true,
      force: true,
      verbose: true,
    });

    emitter.on("info", (info) => {
      console.log(info.message);
    });

    const destPath = path.resolve(
      getProjectRootPath(),
      isTemp ? ".__temp" : ""
    );
    emitter.clone(destPath).then(() => {
      resolve("done");
    });
  });
}

function prompt(promptConfig) {
  const _promptConfig = [
    {
      type: "input",
      name: "projectName",
      message: "What's your project name",
    },
    ...promptConfig,
  ];
  return inquirer.prompt(_promptConfig).then((answers) => {
    _answers = answers;
    debug(_answers);
  });
}

function updateFiles(filesConfig) {
  return Promise.all(
    Object.keys(filesConfig).map((filePath) => {
      const files = glob.sync(path.resolve(getProjectRootPath(), filePath));
      const handleFn = filesConfig[filePath];
      return Promise.race(
        files.map(async (filePath) => {
          const content = await fs.readFile(filePath, "utf-8");
          const updatedContent = await handleFn(content, _answers, {
            absolutePath: filePath,
            relativePath: filePath.replace(getProjectRootPath() + path.sep, ""),
          });
          if (updatedContent)
            await fs.writeFile(filePath, updatedContent, "utf-8");
          return;
        })
      );
    })
  );
}

function removeFiles(files = []) {
  if (!files) return;

  return del(files.map((file) => path.resolve(getProjectRootPath(), file)));
}

function end(endMessage) {
  let msg = `Congratulations, the operation is successful!
Now you can \`cd ${_answers.projectName}\` and install dependencies yourself`;
  if (endMessage) {
    if (_.isString(endMessage)) {
      msg = endMessage;
    } else if (_.isFunction(endMessage)) {
      msg = endMessage(_answers);
    }
  }
  log.success(msg);
}

function checkConfig(config) {
  if (!config.tmplSource) throw "main.tmplSource must not be null";
}

function welcome(welcomeMsg) {
  let msg = "";
  if (_.isFunction(welcomeMsg)) {
    msg = welcomeMsg();
  } else if (_.isString(welcomeMsg)) {
    msg = welcomeMsg;
  }

  if (msg) {
    log.warn(msg);
  }
}

async function handleMain(config) {
  debug(config);

  try {
    // 检查配置
    await checkConfig(config);

    // 欢迎信息
    await welcome(config.welcome);

    // 提示信息
    await prompt(config.prompt);

    // clone 资源
    await cloneResource(config.tmplSource);

    // 修改文件内容
    await updateFiles(config.updateFiles);

    // 删除文件
    await removeFiles(config.removeFiles);

    // 结束提示
    await end(config.endMessage);
  } catch (e) {
    log.error(e);
  }
}

function addFilesTo() {}

async function handleSubcommand(config) {
  debug(config);

  try {
    // 提示信息
    await prompt(config.prompt);

    // clone 资源
    if (config.tmplSource) {
      await cloneResource(config.tmplSource, true);
      await addFilesTo(config.addFilesTo);
    }

    // 修改文件内容
    await updateFiles(config.updateFiles);

    // 删除文件
    await removeFiles(config.removeFiles);

    // 结束提示
    await end(config.endMessage);
  } catch (e) {
    log.error(e);
  }
}

function initHomeDir() {
  fs.ensureDirSync(path.resolve(ncgenHome, "configuration"));
}

export async function cli(args) {
  initHomeDir();

  program.version(pkg.version, "-V, --version").usage(
    `
ncgen/${pkg.version}

Usage Details:

- Build project scaffolding
$ ncgen <configuration file path>
----------------------------------------
Examples:
$ ncgen /path/to/ncgen-config.js
$ ncgen https://<host path>/ncgen-config.js
----------------------------------------
Use 'ncgen <configuration file path> -h' to see the all valid subcommands

- Subcommand to insert or modify project files
$ ncgen <configuration file path>::<subcommand>
-------------------------------------------------
Examples:
$ ncgen /path/to/ncgen-config.js::add-api
$ ncgen https://<domain>/ncgen-config.js::add-api
-------------------------------------------------`
  );
  program.parse(args);

  const [genConfigUrl, subCommand] = _.get(program.args, "[0]", "").split("::");

  if (!genConfigUrl) {
    log.warn(
      "Hi, my name is ncgen.\nI can help you to nicely handle project codes generation.\nType `ncgen -h` to see the help"
    );
    return;
  }

  // 获取代码生成配置文件
  let genConfig;
  const isRemoteUrl = /http[s]?:\/\/.*/.test(genConfigUrl);
  if (isRemoteUrl) {
    const res = await axios.get(genConfigUrl);
    const content = res.data;
    const filePath = path.resolve(
      ncgenHome,
      "configuration",
      md5(content) + ".js"
    );
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content, "utf8");
    }
    genConfig = require(filePath);
  } else {
    genConfig = require(genConfigUrl);
  }

  // 执行子命令，即插入代码片段
  if (subCommand) {
    const { sub: config } = genConfig.default || genConfig;
    const commandConfig = config[subCommand];
    if (!commandConfig) {
      log.error(`${subCommand} is not a valid subcommand`);
      log.info("Valid subcommands:");
      log.success(Object.keys(config));
      return;
    }
    // 子命令模式
    handleSubcommand(commandConfig);
    return;
  }

  // 执行主命令，即生成项目脚手架
  const { main: config } = genConfig.default || genConfig;
  handleMain(config);
}
