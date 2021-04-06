import { api as ncgenApi } from "ncgen";

export default {
  // The main command. Used to generate project scaffolding
  main: {
    // Show welcome message
    welcome: "Welcome",

    // Ask questions. reference: https://github.com/SBoudrias/Inquirer.js/#question
    prompt: [
      // {
      //   type: "input",
      //   name: "author",
      //   message: "What is the author's name",
      // },
    ],

    // Source of project template.reference: https://github.com/Rich-Harris/degit
    tmplSource: "",

    // Update files. Path supports glob: https://github.com/isaacs/node-glob#glob-primer
    updateFiles: {
      // "path/to/files": function (content, options) {
      //   return content;
      // },
    },

    // Delete Files. Path supports glob: https://github.com/isaacs/node-glob#glob-primer
    removeFiles: [],

    // Install dependencies
    installDependencies: {
      skip: false,
      tips: "Dependencies are being installed, it may take a few minutes",
      command: "npm i",
    },

    // Completion prompt message
    complete: "Congratulations, the operation is successful",
  },

  // Subcommand. Used to insert fragment module code
  sub: {
    // key is the name of the subcommand
    "add-component": {

      // Subcommand description
      description: '',

      // Ask questions. reference: https://github.com/SBoudrias/Inquirer.js/#question
      prompt: [
        // {
        //   type: "list",
        //   choices: function () {
        //     return ncgenApi.listDirs("src/");
        //   },
        //   name: "targetDir",
        //   message: "Please select the directory where the code is inserted",
        // },
      ],

      // Source of project template.reference: https://github.com/Rich-Harris/degit
      tmplSource: "https://github.com/daniel-dx/vue3-ncgen-demo",

      // Insert the specified files into the specified location
      addFilesTo: {
        // "path/to/template/file": function () {
        //   return "path/to/project/file";
        // },
      },

      // Add files directly.
      addFiles: function () {
        return {
          "src/assets/test.txt": function () {
            return "some content";
          },
        };
      },

      // Update files. Path supports glob: https://github.com/isaacs/node-glob#glob-primer
      updateFiles: {
        // "path/to/files": function (content, options) {
        //   return content;
        // },
      },

      // Delete Files. Path supports glob: https://github.com/isaacs/node-glob#glob-primer
      removeFiles: [],

      // Completion prompt message
      complete: "Congratulations, the operation is successful",
    },
  },
};
