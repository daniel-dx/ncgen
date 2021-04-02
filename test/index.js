export default {
  // 主命令，用于生成项目脚手架
  main: {
    // 提问问题。参考：https://github.com/SBoudrias/Inquirer.js/#question
    prompt: [
      {
        type: "input",
        name: "author",
        message: "What is the author's name",
      },
    ],

    // 模板来源
    // tmplSource: "daniel-dx/vue3-ncgen-demo",
    tmplSource: "https://github.com/daniel-dx/vue3-ncgen-demo",

    // 更新文件。文件路径支持glob匹配：https://github.com/isaacs/node-glob#glob-primer
    updateFiles: {
      "package.json": function (content, answers, options) {
        content = content.replace("vue3-ncgen-demo", answers.projectName);
        return content;
      },
    },

    // 删除文件。文件路径支持glob匹配：https://github.com/isaacs/node-glob#glob-primer
    removeFiles: ["vite.config.js", "src/**/*.png"],

    // 结束提示信息
    endMessage: "Congratulations, the operation is successful",
    // endMessage: function(answers) {
    //   return ''
    // }
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
