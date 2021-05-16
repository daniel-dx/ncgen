import degit from "@daniel-dx/degit";
import inquirer from "inquirer";
import program from "commander";
import path from "path";
import glob from "glob";
import fs from "fs-extra";
import del from "del";
import _ from "lodash";
import axios from "axios";
import md5 from "md5";
import execa from "execa";
import ora from "ora";
import updateNotifier from "update-notifier";
import requireText from "require-text";

import { debug, log } from "./utils";
import pkg from "../package.json";
import {
  getProjectRootPath,
  answers as _answers,
  data,
  getLocationOfTheProjectClone,
  homePath,
  getFnContext,
  initContext
} from "./context";

const CommandType = {
  MAIN: "m",
  SUB: "s"
};

function cloneResource(tmplSource, isTemp = false) {
  const destPath = path.resolve(
    getProjectRootPath(),
    isTemp ? getLocationOfTheProjectClone() : ""
  );
  if (fs.existsSync(tmplSource)) {
    // 项目模板在本地
    return fs.copy(tmplSource, destPath);
  } else {
    // 项目模板在远程git
    const spinner = ora("Downloading").start();
    return new Promise(resolve => {
      const emitter = degit(tmplSource, {
        cache: false,
        force: true,
        verbose: true
      });

      emitter.on("info", info => {
        debug(info.message);
      });

      emitter.clone(destPath).then(() => {
        spinner.stop();
        resolve("done");
      });
    });
  }
}

function prompt(promptConfig) {
  if (!promptConfig) return;

  const _promptConfig = [...promptConfig];
  if (!data.isSub) {
    _promptConfig.splice(0, 0, {
      type: "input",
      name: "projectName",
      message: "What's your project name",
      validate: function(input) {
        if (!input) return "Please provide project name";
        return true;
      }
    });
  }
  return inquirer.prompt(_promptConfig).then(answers => {
    Object.assign(_answers, answers);
    debug(_answers);
  });
}

function updateFiles(filesConfig) {
  if (!filesConfig) return;

  return Promise.all(
    Object.keys(filesConfig).map(filePath => {
      const files = glob.sync(path.resolve(getProjectRootPath(), filePath));
      const handleFn = filesConfig[filePath];
      return Promise.race(
        files.map(async filePath => {
          const content = await fs.readFile(filePath, "utf-8");
          const updatedContent = await handleFn.call(getFnContext(), content, {
            absolutePath: filePath,
            relativePath: filePath.replace(getProjectRootPath() + path.sep, "")
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

  return del(files.map(file => path.resolve(getProjectRootPath(), file)));
}

function complete(completeMsg) {
  let msg =
    completeMsg === undefined
      ? `Congratulations, the operation is successful!`
      : completeMsg;

  if (msg) {
    log.success(msg);
  }
}

function checkConfig(config) {
  if (!data.isSub && !config.tmplSource)
    throw "main.tmplSource must not be null";

  const found = (resolveValue(config.prompt) || []).find(
    item => item.name === "projectName"
  );
  if (found) {
    throw "projectName is a built-in prompt item name and cannot be used, please replace one";
  }
}

function welcome(welcomeMsg, genConfig) {
  if (welcomeMsg) {
    log.warn(welcomeMsg);
  }

  // 追加可用子命令信息
  if (genConfig.sub) {
    const subcommands = Object.keys(genConfig.sub);
    if (subcommands.length > 0)
      log.warn(`Valid subcommands: ${subcommands.join(", ")}`);
  }
}

function resolveValue(val) {
  return _.isFunction(val) ? val.call(getFnContext()) : val;
}

async function installDependencies(installDeptConfig) {
  if (
    !installDeptConfig ||
    installDeptConfig.skip ||
    !installDeptConfig.command
  )
    return;

  log.info(
    installDeptConfig.tips ||
      "Dependencies are being installed, it may take a few minutes"
  );

  const spinner = ora("Installing").start();

  const subprocess = execa.command(installDeptConfig.command, {
    cwd: getProjectRootPath(),
    shell: true
  });
  subprocess.stdout.pipe(process.stdout);

  await subprocess;

  spinner.stop();
}

async function addFilesTo(addFilesToConfig) {
  if (!addFilesToConfig) return;

  await Promise.all(
    _.map(addFilesToConfig, (val, key) => {
      return fs.copy(
        path.resolve(getLocationOfTheProjectClone(), key),
        path.resolve(getProjectRootPath(), resolveValue(val))
      );
    })
  );
  return fs.remove(getLocationOfTheProjectClone());
}

async function addFiles(addFilesConfig) {
  if (!addFilesConfig) return;

  return Promise.all(
    _.map(addFilesConfig, (val, toPath) => {
      const content = resolveValue(val);
      return fs.writeFile(
        path.resolve(getProjectRootPath(), toPath),
        content,
        "utf8"
      );
    })
  );
}

async function handleMain(config, genConfig, answers) {
  debug(config);

  try {
    // 检查配置
    await checkConfig(config);

    // 欢迎信息
    await welcome(resolveValue(config.welcome), genConfig);

    // 提示信息
    if (answers) {
      Object.assign(_answers, answers);
    } else {
      await prompt(resolveValue(config.prompt));
    }

    // clone 资源
    await cloneResource(resolveValue(config.tmplSource));

    // 修改文件内容
    await updateFiles(resolveValue(config.updateFiles));

    // 删除文件
    await removeFiles(resolveValue(config.removeFiles));

    // 安装依赖
    await installDependencies(resolveValue(config.installDependencies));

    // 结束提示
    await complete(resolveValue(config.complete));
  } catch (e) {
    log.error(e);
  }
}

async function handleSubcommand(config, answers) {
  debug(config);

  try {
    // 检查配置
    await checkConfig(config);

    // 提示信息
    if (answers) {
      Object.assign(_answers, answers);
    } else {
      await prompt(resolveValue(config.prompt));
    }

    // clone 资源
    if (config.tmplSource) {
      await cloneResource(resolveValue(config.tmplSource), true);
      await addFilesTo(resolveValue(config.addFilesTo));
    }

    // 动态增加文件
    await addFiles(resolveValue(config.addFiles));

    // 修改文件内容
    await updateFiles(resolveValue(config.updateFiles));

    // 删除文件
    await removeFiles(resolveValue(config.removeFiles));

    // 结束提示
    await complete(resolveValue(config.complete));
  } catch (e) {
    log.error(e);
    log.warn(
      "Please make sure to execute this subcommand in the project root directory"
    );
    log.warn(`Current path is: ${process.cwd()}`);
  }
}

function initHomeDir() {
  fs.ensureDirSync(path.resolve(homePath, "configuration"));
  fs.ensureDirSync(path.resolve(homePath, "temp_clone"));
}

export async function cli(args) {
  checkVersion();

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

- Subcommand to insert or modify project files
$ ncgen <configuration file path>::<subcommand>
-------------------------------------------------
Examples:
$ ncgen /path/to/ncgen-config.js::add-api
$ ncgen https://<domain>/ncgen-config.js::add-api
-------------------------------------------------
Use ncgen <configuration file path>::help to see all valid subcommands`
  );

  program
    .command("genConf")
    .description("Generate configuration file")
    .option("-n --name <name>", "Configuration file name")
    .action(function(option) {
      let name = option.name || "ncgen-config.js";
      name = name.search(/\.js$/) === -1 ? name + ".js" : name;
      fs.writeFileSync(
        path.resolve(".", name),
        requireText("./config-template.js", require),
        "utf8"
      );
      log.success(`Generated successfully: ${name}`);
    });

  program.on("command:*", function() {
    debug("Avoid using <configuration file path> as an unknow command");
  });

  program.parse(args);

  const [genConfigUrl, subCommand] = _.get(program.args, "[0]", "").split("::");

  if (["genConf"].indexOf(genConfigUrl) >= 0) return;

  if (!genConfigUrl) {
    log.warn(
      "Hi, my name is ncgen.\nI can help you to nicely handle project codes generation.\nType `ncgen -h` to see the help"
    );
    return;
  }

  if (subCommand) {
    await generate(genConfigUrl, {
      type: CommandType.SUB,
      command: subCommand
    });
  } else {
    await generate(genConfigUrl, {
      type: CommandType.MAIN
    });
  }
}

export async function generate(
  config,
  options = { type: CommandType.MAIN },
  calledByCli = true
) {
  if (options.type === CommandType.SUB && !options.command) {
    log.error(`options.command is required`);
    return;
  }

  initContext();

  if (options.cwd) data.cwd = path.resolve(options.cwd);

  // 获取代码生成配置文件
  let genConfig;
  if (_.isString(config)) {
    // 如果是配置文件路径
    const genConfigUrl = config;
    const isRemoteUrl = /http[s]?:\/\/.*/.test(genConfigUrl);
    let genConfigContent = "";
    if (isRemoteUrl) {
      const res = await axios.get(genConfigUrl);
      genConfigContent = res.data;
    } else {
      genConfigContent = requireText(path.resolve(genConfigUrl), require);
    }
    const filePath = path.resolve(
      homePath,
      "configuration",
      md5(genConfigContent) + ".js"
    );
    // 命令行调用，将 import "ncgen" 替换成引用全局的模块路径
    if (calledByCli) {
      const { stdout: globalNodeModulesPath } = execa.commandSync(
        "npm root -g"
      );
      genConfigContent = genConfigContent
        .replace(/from\s+['"](ncgen)['"]/, `from "${globalNodeModulesPath}/$1"`)
        .replace(
          /require\(['"](ncgen)['"]\)/,
          `require("${globalNodeModulesPath}/$1")`
        );
      fs.writeFileSync(filePath, genConfigContent, "utf8");
    } else {
      const nodeModulesPath = path.resolve(path.dirname(module.path));
      genConfigContent = genConfigContent
        .replace(/from\s+['"](ncgen)['"]/, `from "${nodeModulesPath}"`)
        .replace(/require\(['"](ncgen)['"]\)/, `require("${nodeModulesPath}")`);
      fs.writeFileSync(filePath, genConfigContent, "utf8");
    }
    genConfig = require(filePath);
  } else {
    genConfig = config;
  }

  // 执行子命令，即插入代码片段
  if (options.type === CommandType.SUB) {
    const subCommand = options.command;
    const { sub: config } = genConfig.default || genConfig;
    const commandConfig = config[subCommand];
    if (!commandConfig) {
      if (subCommand !== "help")
        log.error(`${subCommand} is not a valid subcommand`);
      log.info("Valid subcommands:");
      log.success(`
${Object.keys(config)
  .map(key => {
    return `- ${key}\n${config[key].description || ""}\n\n`;
  })
  .join("")}
      `);
      return;
    }
    // 子命令模式
    data.isSub = true;
    await handleSubcommand(commandConfig, options.answers);
    return;
  }

  // 执行主命令，即生成项目脚手架
  const _genConfig = genConfig.default || genConfig;
  const { main: mainConfig } = _genConfig;
  await handleMain(mainConfig, _genConfig, options.answers);
}

function checkVersion() {
  const notifier = updateNotifier({ pkg, updateCheckInterval: 0 });

  if (notifier.update) {
    notifier.notify();
  }
}
