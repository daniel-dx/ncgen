# Guide

## Get started

1. Installation

```bash
$ npm i ncgen -g # yarn global add ncgen
```

2. Generate configuration files

```bash
$ ncgen genConf
```

This will generate a file called `ncgen-config.js` in your current directory

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
$ ncgen https://raw.githubusercontent.com/daniel-dx/ncgen/master/test/index.js
```

- Execute subcommand: update project code incrementally

```bash
$ ncgen <configuration file path>::<subcommand>

# Example: Execute the add-api subcommand
$ ncgen ./ncgen-config.js::add-api
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
