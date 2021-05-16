# 指南

## 快速上手

> 你只需提供一份描述代码生成器逻辑的配置文件，请按照以下步骤创建你的第一个代码生成器

1. 安装

```sh
$ npm i ncgen -g # yarn global add ncgen
```

2. 生成配置文件

```sh
$ ncgen genConf
```

这将会在你当前目录下生成一个 `ncgen-config.js` 的文件

3. 编辑配置文件

假设模板项目为：[vue3-ncgen-demo](https://github.com/daniel-dx/vue3-ncgen-demo)

将 [模板项目对应的示例 ncgen-config.js](https://github.com/daniel-dx/vue3-ncgen-demo/blob/master/ncgen-config.js) 的内容复制到你的 `ncgen-config.js`

> 各配置项的详细介绍请查看：[配置帮助文档](config.html)

4. 运行

```sh
# 运行主命令生成项目脚手架
$ ncgen ./ncgen-config.js

# 查看所有子命令
$ ncgen ./ncgen-config.js::help

# 运行子命令在生成的项目中新增组件
$ ncgen ./ncgen-config.js::add-component
```

::: tip 提示
如需更详细的手把手的教程，请阅读这篇文章：[新生代小鲜肉之代码生成器](https://juejin.cn/post/6960427434235658277)
:::

## NodeJS API 运行

ncgen 也支持通过 NodeJS API（非命令行） 的方式运行，示例如下。

```js
const { generate } = require("ncgen"); // or import { generate } from "ncgen"

// 执行主命令
generate("path/to/ncgen-config.js", { type: "m" });

// 执行子命令
generate("path/to/ncgen-config.js", { type: "s", command: "add-component" });
```

该 API 的具体介绍请查看 [generate](/zh/API.html#generate-config-options-%E2%87%92-promise)

## 属于你的生成器

假设你现在想开发一个叫 **cook** 的代码生成器工具，你只需按照以下步骤即可快速完成开发

第一步：创建代码生成器项目

```sh
$ npm init @ncgen/app
```

第二步：按照你代码生成器的逻辑修改 `ncgen-config.js`

> 创建子命令可用以下命令完成，以省去你复制粘贴的操作

```sh
cd cook
$ npm init @ncgen/app add-sub
```

第三步：发布你的代码生成器

```sh
$ cd cook
$ npm run release
```

## 命令行

- 生成配置文件

```bash
$ ncgen genConf

# 例子1: 在当前目录下生成 ncgen-config.js 文件
$ ncgen genConf

# 例子2: 在当前目录下生成指定名称的文件
$ ncgen genConf -n code-config.js
```

- 执行主命令：生成项目脚手架

```bash
ncgen <configuration file path>

# 例子1: 加载本地配置文件
$ ncgen ./ncgen-config.js

# 例子2: 加载远程配置文件
$ ncgen https://raw.githubusercontent.com/daniel-dx/vue3-ncgen-demo/master/ncgen-config.js
```

- 执行子命令：增量更新项目代码

```bash
$ ncgen <configuration file path>::<subcommand>

# 例子: 执行 add-component 子命令
$ ncgen ./ncgen-config.js::add-component
```

- 查看所有子命令

```bash
$ ncgen <configuration file path>::help

# 例子
$ ncgen ./ncgen-config.js::help
```

## 答案获取

所有支持 `function` 类型的属性（除了 `welcome`, `prompt`, `description` 外），都可以在 `function` 里面通过 `this.$answers` 获取问题答案数据。

假设你的问题项设置如下：

```js
// 例子
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

那么你可以在 `updateFiles` 中通过 `this.$answers` 获取 `name` 的值。

```js
{
  main: {
    ...
    updateFiles: {
      "package.json": function (content, options) {
        // 假设用户输入的 `name` 的值为 `demo name`，那么你可以通过以下获取到各种格式的值
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
