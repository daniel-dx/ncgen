# Config

::: tip TIP
For all attributes that support `function` type (except `welcome`, `prompt`, `description`), you can use `this.$answers` in their `function` type value to get the question answer data
:::

## main

> object

Main command, used to generate project scaffolding

```js
// Example
{
  main: {
  }
}
```

### welcome

> string | function

Show welcome message

```js
// Example
{
  main: {
    welcome: "Welcome",
  }
}
```

### prompt

> array | function

Configuration of asking questions. Please refer to [Inquirer.js](https://github.com/SBoudrias/Inquirer.js/#question)

::: warning NOTE
In the `prompt` of `main`, there is a question item with the attribute `projectName` built in, so you don't need and can't declare the `name` as the question item of `projectName`
:::

```js
// Example
{
  main: {
    prompt: [
      {
        type: "input",
        name: "name",
        message: "What is your name"
      }
    ];
  }
}
```

### tmplSource

> string | function

Project template url. Please refer to [degit](https://github.com/daniel-dx/degit)

```js
// Example
{
  main: {
    tmplSource: "https://github.com/daniel-dx/vue3-ncgen-demo";
  }
}
```

### updateFiles

> object | function

Modify the content of the project file.

The key is the file path, which supports [glob](https://github.com/isaacs/node-glob#glob-primer) matching.

The value of key is the callback function, which has two parameters `content` and `options`. `content` is the content of the currently processed file in the matched file list; `options` stores the relevant information of the file, such as the path of the file

```js
// Example 1
{
  main: {
    updateFiles: {
      "package.json": function (content, options) {
        const answers = this.$answers
        return api.replace(content, {
          "vue3-ncgen-demo": answers.projectNameObj.kebabCase
        })
      }
    }
  }
}

// Example 2: The function type is often used in scenarios where a dynamic path is required
{
  main: {
    updateFiles() {
      const fileName ='package.json'
      const answers = this.$answers
      return {
        [fileName]: function (content, options) {
          return api.replace(content, {
            "vue3-ncgen-demo": answers.projectNameObj.kebabCase
          })
        }
      }
    }
  }
}
```

### removeFiles

> string[] | function

Delete the specified files.

File path support [glob](https://github.com/isaacs/node-glob#glob-primer) matching

```js
// Example
{
  main: {
    removeFiles: ["vite.config.js", "src/**/*.png"];
  }
}
```

### installDependencies

> object | function

Configuration of dependencies installation, the configuration information is as follows:

- skip {boolean}: whether to skip installation dependencies
- tips {string}: tips
- command {string}: execute the command to install dependencies

```js
// Example
{
  main: {
    installDependencies: {
      skip: false,
      tips: "Dependencies are being installed, it may take a few minutes",
      command: "npm i",
    }
  }
}
```

### complete

> string | function

Completion prompt message

::: warning NOTE

1. If the value is empty, the prompt message will not be hidden, but the default completion prompt message will be displayed.
2. If you don't want to use the default output (for example, you want to personalize the display of the prompt message), you can use the `function` value, and then `return false`.
   :::

```js
// Example
{
  main: {
    complete: "Congratulations, the operation is successful";
  }
}
```

## sub

> object

Subcommands are used to incrementally update the project code. Its key is the name of the subcommand, which is specified by the developer

```js
// Example: Add a subcommand of add-api
{
  sub: {
    "add-api": {}
  }
}
```

### description

> string

Used to describe the subcommand.

This information will be displayed when you execute `ncgen ./ncgen-config::help` to list all subcommands

```js
// Example: Add a subcommand of add-api
{
  sub: {
    "add-api": {
      description: "Add service api"
    }
  }
}
```

### prompt

Refer to [main.prompt](CONFIG.html#prompt)

Unlike `main.prompt`, there is no built-in `projectName` question item.

### tmplSource

Refer to [main.tmplSource](CONFIG.html#tmplsource)

The difference with `main.tmplSource` is that `tmplSource` here is not required, while the former is required

### addFilesTo

> object | function

Insert the files with the specified path in the project template into the specified location in the project

The key is the file path of the project template, and the value of key is the file of the inserted project, which can be either `function` or `string`

::: warning NOTE

This item is invalid when `tmplSource` is empty
:::

```js
// Example 1: Copy src/components/HelloWorld.vue in the project template to src/components/{user-provided component name}.vue
{
  sub: {
    "add-api": {
      addFilesTo: {
        "src/components/HelloWorld.vue": function () {
          const answers = this.$answers;
          return `src/components/${this.$answers.compNameObj.upperFirstCamelCase}.vue`;
        },
      },
    }
  }
}

// Example 2: Copy all files in the src/components directory of the project template to the src/assets/bb directory of the project
{
  sub: {
    "add-api": {
      addFilesTo: {
        "src/components": `src/assets/bb`,
      },
    }
  }
}
```

### addFiles

> object | function

Directly add files without relying on project templates

The key is the file path of the project, and the value of key is the content of the file, which can be either `function` or `string`

```js
// Example: Add a src/assets/test.txt file to the project with the content "some content"
{
  sub: {
    "add-api": {
      addFiles: {
        "src/assets/test.txt": "some content",
      },
    }
  }
}
```

### updateFiles

Refer to [main.updateFiles](CONFIG.html#updatefiles)

### removeFiles

Refer to [main.removeFiles](CONFIG.html#removefiles)

### complete

Refer to [main.complete](CONFIG.html#complete)
