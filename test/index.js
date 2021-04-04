import { api as ncgenApi } from "ncgen";

export default {
  // 主命令，用于生成项目脚手架
  main: {
    // welcome: 'Welcome to demo code generator',
    welcome: function () {
      // 如果不想使用默认的输出，可返回空(return or return null or return false)，然后自己处理
      return "Welcome to demo code generator";
    },

    // 提问问题。参考：https://github.com/SBoudrias/Inquirer.js/#question
    prompt: [
      {
        type: "input",
        name: "author",
        message: "What is the author's name",
      },
    ],

    // 模板来源。参考：https://github.com/Rich-Harris/degit
    tmplSource: "https://github.com/daniel-dx/vue3-ncgen-demo",

    // 更新文件。文件路径支持glob匹配：https://github.com/isaacs/node-glob#glob-primer
    updateFiles: {
      "package.json": function (content, answers, options) {
        const projectNameObj = ncgenApi.transformStr(answers.projectName);
        content = ncgenApi.replace(content, {
          "vue3-ncgen-demo": projectNameObj.kebabCase,
        });
        return content;
      },
    },

    // 删除文件。文件路径支持glob匹配：https://github.com/isaacs/node-glob#glob-primer
    removeFiles: ["vite.config.js", "src/**/*.png"],

    // 安装依赖
    installDependencies: {
      skip: false,
      tips: "Dependencies are being installed, it may take a few minutes",
      command: "npm i",
    },

    // 完成提示信息
    // complete: "Congratulations, the operation is successful",
    complete: function (answers) {
      // 如果不想使用默认的输出，可返回空(return or return null or return false)，然后自己处理
      return "Congratulations, the operation is successful";
    },
  },

  // 子命令，用于插入片段代码
  sub: {
    // key 为子命令名
    "add-component": {
      // 提问问题。参考：https://github.com/SBoudrias/Inquirer.js/#question
      prompt: [
        {
          type: "list",
          choices: function () {
            return ncgenApi.listDirs("src/");
          },
          name: "targetDir",
          message: "What is the author's name",
        },
        {
          type: "input",
          name: "compName",
          message: "What is the component name?",
          validate: function (input) {
            if (!input) return "Please provide component name";
            return true;
          },
        },
      ],

      // 模板来源
      tmplSource: "https://github.com/daniel-dx/vue3-ncgen-demo",

      // 插入位置
      addFilesTo: {
        // 模板项目的文件路径: 实际项目的文件路径
        "src/components/HelloWorld.vue": function (answers) {
          return `src/${answers.targetDir}/${
            ncgenApi.transformStr(answers.compName).upperFirstCamelCase
          }.vue`;
        },
        "src/components": `src/assets/bb`,
      },

      // 直接新增文件。
      addFiles: function (answers) {
        return {
          "src/assets/test.txt": function (answers) {
            return "some content";
          },
        };
      },

      // 更新文件。文件路径支持glob匹配：https://github.com/isaacs/node-glob#glob-primer
      updateFiles: function (answers) {
        const compNameObj = ncgenApi.transformStr(answers.compName);
        return {
          [`src/${answers.targetDir}/${compNameObj.upperFirstCamelCase}.vue`]: function (
            content,
            answers,
            options
          ) {
            return ncgenApi.replace(content, {
              "HelloWorld.vue": compNameObj.upperFirstCamelCase,
            });
          },
        };
      },

      // 删除文件。文件路径支持glob匹配：https://github.com/isaacs/node-glob#glob-primer
      removeFiles: ["path/to/file-b", "path/to/rmdir/*"],

      // 结束提示信息
      endMessage: "",
    },
    "add-modal": {},
  },
};
