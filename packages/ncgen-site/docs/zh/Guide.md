# 指南

## 快速上手

1. 安装

```sh
$ npm i ncgen -g # yarn global add ncgen
```

2. 生成配置文件

```sh
$ ncgen genConf
```

这将会在你当前目录下生成一个 `ncgen-config.js` 的文件

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
$ ncgen https://raw.githubusercontent.com/daniel-dx/ncgen/master/test/index.js
```

- 执行子命令：增量更新项目代码

```bash
$ ncgen <configuration file path>::<subcommand>

# 例子: 执行 add-api 子命令
$ ncgen ./ncgen-config.js::add-api
```

- 查看所有子命令

```bash
$ ncgen <configuration file path>::help

# 例子
$ ncgen ./ncgen-config.js::help
```
