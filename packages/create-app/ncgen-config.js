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
    tmplSource: "https://github.com/daniel-dx/vue3-ncgen-demo.git",

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
    // <!-- Don't touch me - add subcommnad -->
  }
};
