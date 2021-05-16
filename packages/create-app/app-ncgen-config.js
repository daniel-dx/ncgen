const { api, log, _ } = require("ncgen");

module.exports = {
  // The main command. Used to generate project scaffolding. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#main
  main: {
    // Show welcome message. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#welcome
    welcome: "Welcome to develop your own code generator",

    // Ask questions. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#prompt
    prompt: [],

    // Source of project template. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#tmplsource
    tmplSource: "daniel-dx/ncgen/packages/create-app",

    // Update files. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#updatefiles
    updateFiles: {
      "index.js": function(content) {
        return api.replace(content, {
          "app-ncgen-config": "ncgen-config"
        });
      },
      "package.json": function(content, options) {
        const answers = this.$answers;
        return api.replace(content, [
          ["@ncgen/create-app", answers.projectNameObj.kebabCase],
          ["create-app", answers.projectNameObj.kebabCase],
          [/"version": ".*?",/, '"version": "0.1.0",']
        ]);
      },
      "README.md": function(content, options) {
        const answers = this.$answers;
        return `
# ${answers.projectNameObj.kebabCase}

## Install
\`\`\`sh
$ npm i ${answers.projectNameObj.kebabCase} -g # yarn ${answers.projectNameObj.kebabCase} add ncgen
\`\`\`

## Usage
\`\`\`sh
$ ${answers.projectNameObj.kebabCase} -h
\`\`\`

## Develop
\`\`\`sh
# Debug main command
$ node bin/cli

# Debug subcommand
$ node bin/cli subcommand-name
\`\`\`

## Publish
\`\`\`sh
$ npm run release
\`\`\`
`;
      }
    },

    // Delete Files. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#removefiles
    removeFiles: ["./app-ncgen-config.js"],

    // Install dependencies. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#installdependencies
    installDependencies: {
      skip: false,
      tips: "Dependencies are being installed, it may take a few minutes",
      command: "npm i"
    },

    // Completion prompt message. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#complete
    complete: `
Congratulations, the operation is successful!
Now you can modify the content of ncgen-config.js according to your code generator logic.
Run 'node bin/cli' to debug
`
  },

  // Subcommand. Used to insert fragment module code. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#sub
  sub: {
    // key is the name of the subcommand
    "add-sub": {
      // Subcommand description. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#description
      description: "Add subcommand",

      // Ask questions. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#prompt-2
      prompt: [
        {
          type: "input",
          name: "name",
          message: "What is the subcommand name",
          validate(input) {
            if (!input) return "The subcommand name is required";
            return true;
          }
        }
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
        "ncgen-config.js": function(content, options) {
          const answers = this.$answers;
          return api.insertBefore(content, {
            "// <!-- Don't touch me - add subcommnad -->": `
    "${answers.nameObj.kebabCase}": {
      // Subcommand description. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#description
      description: "${answers.nameObj.humanized}",

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
    },
            `
          });
        }
      },

      // Delete Files. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#removefiles-2
      removeFiles: [],

      // Completion prompt message. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#complete-2
      complete: function() {
        return `
Congratulations, the operation is successful!
Now you can start the development of your subcommand (${this.$answers.nameObj.kebabCase}) in ncgen-config.js.
Run 'node bin/cli ${this.$answers.nameObj.kebabCase}' to debug
        `
      }
    }
  }
};
