# Guide

## Get started

> You only need to provide a configuration file describing the logic of the code generator, please follow the steps below to create your first code generator

1. Installation

```bash
$ npm i ncgen -g # yarn global add ncgen
```

2. Generate configuration file

```bash
$ ncgen genConf
```

This will generate a file called `ncgen-config.js` in your current directory

3. Edit the configuration file

Assume that the template project is: [vue3-ncgen-demo](https://github.com/daniel-dx/vue3-ncgen-demo)

Copy the content of [example ncgen-config.js corresponding to the template project](https://github.com/daniel-dx/vue3-ncgen-demo/blob/master/ncgen-config.js) to your `ncgen-config.js`

> For detailed introduction of each configuration item, please see: [Configuration Help Document](config.html)

4. Run

```sh
# Run the main command to generate project scaffolding
$ ncgen ./ncgen-config.js

# View all subcommands
$ ncgen ./ncgen-config.js::help

# Run subcommands to add new component to the generated project
$ ncgen ./ncgen-config.js::add-component
```

::: tip Tips
For a more detailed hands-on tutorial, please read this article：[The new generation of code generator](https://dev.to/danieldx/the-new-generation-of-code-generator-26h1)
:::

## Run by NodeJS API

ncgen also supports running through NodeJS API (not command line), the example is as follows.

```js
const { generate } = require("ncgen"); // or import { generate } from "ncgen"

// Execute the main command
generate("path/to/ncgen-config.js", { type: "m" });

// Execute subcommand
generate("path/to/ncgen-config.js", { type: "s", command: "add-component" });
```

For the specific introduction of the API, please see [generate](/API.html#generate-config-options-%E2%87%92-promise)

## Your own generator

Suppose you now want to develop a code generator tool called **cook**, you only need to follow the steps below to quickly complete the development

Step 1: Create a code generator project

```sh
$ npm init @ncgen/app
```

Step 2: Modify `ncgen-config.js` according to the logic of your code generator

> Create sub-commands can be completed with the following commands to save you from copying and pasting

```sh
cd cook
$ npm init @ncgen/app add-sub
```

Step 3: Publish your code generator

```sh
$ cd cook
$ npm run release
```

## Command Line

- Generate configuration files

```bash
$ ncgen genConf

# Example 1: Generate the ncgen-config.js file in the current directory
$ ncgen genConf

# Example 2: Generate a file with the specified name in the current directory
$ ncgen genConf -n code-config.js
```

- Execute the main command: generate project scaffolding

```bash
ncgen <configuration file path>

# Example 1: Load local configuration file
$ ncgen ./ncgen-config.js

# Example 2: Load remote configuration file
$ ncgen https://raw.githubusercontent.com/daniel-dx/vue3-ncgen-demo/master/ncgen-config.js
```

- Execute subcommand: update project code incrementally

```bash
$ ncgen <configuration file path>::<subcommand>

# Example: Execute the add-component subcommand
$ ncgen ./ncgen-config.js::add-component
```

- List all subcommands

```bash
$ ncgen <configuration file path>::help

# Example
$ ncgen ./ncgen-config.js::help
```

## Answer get

For all attributes that support `function` type (except `welcome`, `prompt`, `description`), you can use `this.$answers` in their `function` type value to get the question answer data.

Suppose your question items are set as follows:

```js
// example
{
  main: {
    ...
    prompt: [
      {
        type: "input",
        name: "name",
        message: "What is your name"
      }
    ],
    ...
  }
}
```

Then you can get the value of `name` through `this.$answers` in `updateFiles`.

```js
{
  main: {
    ...
    updateFiles: {
      "package.json": function (content, options) {
        // Assuming that the value of `name` entered by the user is `demo name`, then you can get the value in various formats through the following
        this.$answers.name // demo name
        this.$answers.nameObj.kebabCase // demo-name
        this.$answers.nameObj.camelCase // demoName
        this.$answers.nameObj.snakeCase // demo_name
        this.$answers.nameObj.upperFirstCamelCase // DemoName
        this.$answers.nameObj.title // Demo Name
        this.$answers.nameObj.humanized // Demo name
      }
    },
    ...
  }
}
```
