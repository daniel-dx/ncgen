# Config

::: tip 提示
所有支持 `function` 类型的属性（除了 `welcome`, `prompt`, `description` 外），都可以在 `function` 里面通过 `this.$answers` 获取问题答案数据。具体参考 [问题答案获取](Guide.html#答案获取)
:::

## main

> object

主命令，用于生成项目脚手架

```js
// 例子
{
  main: {
  }
}
```

### welcome

> string | function

显示欢迎信息

```js
// 例子
{
  main: {
    welcome: "Welcome",
  }
}
```

### prompt

> array | function

询问问题配置。请参考[Inquirer.js](https://github.com/SBoudrias/Inquirer.js/#question)

::: warning 注意
在 `main` 的 `prompt` 中，已内置有属性为 `projectName` 的问题项，所以你不必也不能再声明 `name` 为 `projectName` 的问题项
:::

```js
// 例子
{
  main: {
    prompt: [
      {
        type: "input",
        name: "name",
        message: "What is your name"
      }
    ],
  }
}
```

### tmplSource

> string | function

项目模板地址。支持 git地址 和 本地目录

git地址格式请参考[degit](https://github.com/daniel-dx/degit)

```js
// git地址 例子
{
  main: {
    tmplSource: "https://github.com/daniel-dx/vue3-ncgen-demo",
  }
}

// 本地目录 例子
{
  main: {
    tmplSource: "/Users/daniel/Projects/vue3-ncgen-demo",
  }
}
```

### updateFiles

> object | function

修改项目文件内容。

键为文件路径，支持 [glob](https://github.com/isaacs/node-glob#glob-primer) 匹配。

键值为 callback 函数，有两个参数 `content` 和 `options`。`content` 为匹配的文件列表中当前处理的文件内容；`options` 存放该文件的相关信息，比如文件的路径

```js
// 例子1
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

// 例子2: function类型常用于需要动态的路径的场景
{
  main: {
    updateFiles() {
      const fileName = 'package.json'
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

删除指定文件。

文件路径支持 [glob](https://github.com/isaacs/node-glob#glob-primer) 匹配

```js
// 例子
{
  main: {
    removeFiles: ["vite.config.js", "src/**/*.png"],
  }
}
```

### installDependencies

> object | function

安装依赖配置，配置信息如下：

- skip {boolean}: 是否跳过安装依赖环节
- tips {string}: 提示信息
- command {string}: 执行安装依赖的命令

```js
// 例子
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

完成提示信息

::: warning 注意

1. 如果该值为空，并不会隐藏提示信息，而是会显示默认的完成提示信息。
2. 如果不想使用默认的输出（比如想个性化完成提示信息的展示），可使用 `function` 值，然后 `return false` 即可。
   :::

```js
// 例子
{
  main: {
    complete: "Congratulations, the operation is successful",
  }
}
```

## sub

> object

子命令，用于增量更新项目代码。它的键就是子命令的名称，由开发者自己指定

```js
// 例子: 增加一个 add-api 的子命令
{
  sub: {
    "add-api":  {}
  }
}
```

### description

> string

用于描述子命令的功能。

这些信息会在执行 `ncgen ./ncgen-config::help` 列出所有子命令时显示出来

```js
// 例子: 增加一个 add-api 的子命令
{
  sub: {
    "add-api":  {
      description: "Add service api"
    }
  }
}
```

### prompt

参考 [main.prompt](CONFIG.html#prompt)

与 `main.prompt` 不同的是这里没有内置的 `projectName` 问题项。

### tmplSource

参考 [main.tmplSource](CONFIG.html#tmplsource)

与 `main.tmplSource` 不同的是这里的 `tmplSource` 非必须，而前者是必须的

### addFilesTo

> object | function

将项目模板中指定路径的文件插入到项目中指定的位置

键为项目模板的文件路径，键值为插入的项目的文件，可以是 `function`， 也可以是 `string`

::: warning 注意

当 `tmplSource` 为空时 该项无效
:::

```js
// 例子1：将项目模板中的 src/components/HelloWorld.vue 复制到项目的 src/components/{用户提供的组件名}.vue
{
  sub: {
    "add-api":  {
      addFilesTo: {
        "src/components/HelloWorld.vue": function () {
          const answers = this.$answers;
          return `src/components/${this.$answers.compNameObj.upperFirstCamelCase}.vue`;
        },
      },
    }
  }
}

// 例子2：将项目模板中 src/components 目录下的所有文件复制到项目的 src/assets/bb 目录中
{
  sub: {
    "add-api":  {
      addFilesTo: {
        "src/components": `src/assets/bb`,
      },
    }
  }
}
```

### addFiles

> object | function

直接新增文件，不依赖于项目模板

键为项目的文件路径，键值为该文件的内容，可以是 `function`， 也可以是 `string`

```js
// 例子: 在项目中增加一个 src/assets/test.txt 文件，内容为 "some content"
{
  sub: {
    "add-api":  {
      addFiles: {
        "src/assets/test.txt": "some content",
      },
    }
  }
}
```

### updateFiles

参考 [main.updateFiles](CONFIG.html#updatefiles)

### removeFiles

参考 [main.removeFiles](CONFIG.html#removefiles)

### complete

参考 [main.complete](CONFIG.html#complete)
