const { api, log, _ } = require("ncgen");

module.exports = {
  // The main command. Used to generate project scaffolding. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#main
  main: {
    // Show welcome message. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#welcome
    welcome: "Welcome to use (Vue 3 + TypeScript + Vite) project generator",

    // Ask questions. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#prompt
    prompt: [
      {
        type: "input",
        name: "author",
        message: "What is the author's name"
      }
    ],

    // Source of project template. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#tmplsource
    tmplSource: "https://github.com/daniel-dx/vue3-ncgen-demo.git",

    // Update files. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#updatefiles
    updateFiles: {
      "package.json": function(content, options) {
        const answers = this.$answers;
        return api.replace(content, {
          "vue3-ncgen-demo": answers.projectNameObj.kebabCase,
          "Daniel.xiao": answers.author
        });
      }
    },

    // Delete Files. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#removefiles
    removeFiles: ["ncgen-config.js", "src/components/base/Template.vue"],

    // Install dependencies. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#installdependencies
    installDependencies: {
      skip: true,
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
      description: "Add vue component",

      // Ask questions. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#prompt-2
      prompt: [
        {
          type: "list",
          choices: function() {
            return api.listDirs("src/components/");
          },
          name: "category",
          message: "Please select the category"
        },
        {
          type: "input",
          name: "name",
          message: "What is the component name",
          validate(input) {
            if (!input) return "The component name is required";
            return true;
          }
        }
      ],

      // Source of project template. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#tmplsource-2
      tmplSource: "https://github.com/daniel-dx/vue3-ncgen-demo.git",

      // Insert the specified files into the specified location. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#addfilesto
      addFilesTo: function() {
        const answers = this.$answers;
        return {
          "src/components/base/Template.vue": `src/components/${answers.category}/${answers.nameObj.upperFirstCamelCase}.vue`
        };
      },

      // Add files directly. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#addfiles
      addFiles: function() {
        const answers = this.$answers;
        return {
          [`src/components/${answers.category}/${answers.nameObj.upperFirstCamelCase}.md`]: function() {
            return `# ${answers.nameObj.upperFirstCamelCase}`;
          }
        };
      },

      // Update files. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#updatefiles-2
      updateFiles: function() {
        const answers = this.$answers;
        return {
          "src/App.vue": function(content, options) {
            return api.insertBefore(content, {
              "// <!-- Don't touch me - import component -->": `import ${answers.nameObj.upperFirstCamelCase} from './components/${answers.category}/${answers.nameObj.upperFirstCamelCase}.vue'`,
              "// <!-- Don't touch me - register component -->": `${answers.nameObj.upperFirstCamelCase},`,
              "<!-- Don't touch me - place component -->": `<${answers.nameObj.upperFirstCamelCase}/>`
            });
          },
          [`src/components/${answers.category}/${answers.nameObj.upperFirstCamelCase}.vue`]: function(
            content,
            options
          ) {
            return api.replace(content, {
              Template: `${answers.nameObj.upperFirstCamelCase}`
            });
          }
        };
      },

      // Delete Files. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#removefiles-2
      removeFiles: [],

      // Completion prompt message. Doc: https://daniel-dx.github.io/ncgen/CONFIG.html#complete-2
      complete: "Congratulations, the operation is successful"
    }
  }
};
