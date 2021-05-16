const { api, log, _ } = require("ncgen");

module.exports = {
  // The main command. Used to generate project scaffolding. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#main
  main: {
    // Show welcome message. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#welcome
    welcome: "Welcome",

    // Ask questions. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#prompt
    prompt: [
      // {
      //   type: "input",
      //   name: "author",
      //   message: "What is the author's name",
      // },
    ],

    // Source of project template. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#tmplsource
    tmplSource: "",

    // Update files. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#updatefiles
    updateFiles: {
      // "path/to/project/files": function (content, options) {
      //   return content;
      // },
    },

    // Delete Files. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#removefiles
    removeFiles: [],

    // Install dependencies. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#installdependencies
    installDependencies: {
      skip: false,
      tips: "Dependencies are being installed, it may take a few minutes",
      command: "npm i"
    },

    // Completion prompt message. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#complete
    complete: "Congratulations, the operation is successful"
  },

  // Subcommand. Used to insert fragment module code. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#sub
  sub: {
    // key is the name of the subcommand
    "add-component": {
      // Subcommand description. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#description
      description: "",

      // Ask questions. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#prompt-2
      prompt: [
        // {
        //   type: "list",
        //   choices: function () {
        //     return api.listDirs("src/");
        //   },
        //   name: "targetDir",
        //   message: "Please select the directory where the code is inserted",
        // },
      ],

      // Source of project template. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#tmplsource-2
      tmplSource: "",

      // Insert the specified files into the specified location. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#addfilesto
      addFilesTo: {
        // "path/to/template/file": function () {
        //   return "path/to/project/file";
        // },
      },

      // Add files directly. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#addfiles
      addFiles: function() {
        return {
          // "path/to/project/file": function() {
          //   return "some content";
          // }
        };
      },

      // Update files. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#updatefiles-2
      updateFiles: {
        // "path/to/project/files": function (content, options) {
        //   return content;
        // },
      },

      // Delete Files. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#removefiles-2
      removeFiles: [],

      // Completion prompt message. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#complete-2
      complete: "Congratulations, the operation is successful"
    }
  }
};
