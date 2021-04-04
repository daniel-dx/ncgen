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
      tips: 'Dependencies are being installed, it may take a few minutes',
      command: 'npm i'
    },

    // 完成提示信息
    // complete: "Congratulations, the operation is successful",
    complete: function(answers) {
      // 如果不想使用默认的输出，可返回空(return or return null or return false)，然后自己处理
      return 'Congratulations, the operation is successful'
    }
  },

  // 子命令，用于插入片段代码
  sub: {
    // key 为子命令名
    "add-api": {
      // 提问问题。参考：https://github.com/SBoudrias/Inquirer.js/#question
      prompt: [],

      // 模板来源
      tmplSource: "",

      // 插入位置
      // addFilesTo: "",
      addFilesTo: {
        "/file-a": "path/a",
        "/dir/*": "path/b",
      },

      // 直接新增文件。
      addFiles: {
        "path/to/file-a": function () {
          return "some content";
        },
      },

      // 更新文件。文件路径支持glob匹配：https://github.com/isaacs/node-glob#glob-primer
      updateFiles: {
        "path/to/file-a": function (files) {},
        "path/to/dir/*": function (files) {},
      },

      // 删除文件。文件路径支持glob匹配：https://github.com/isaacs/node-glob#glob-primer
      removeFiles: ["path/to/file-b", "path/to/rmdir/*"],

      // 结束提示信息
      endMessage: "",
    },
    "add-modal": {},
  },
};
