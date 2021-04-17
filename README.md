# ncgen
A very nice code generator

## Install

```bash
$ npm i ncgen -g
```
## Usage

- Generate configuration file
```
$ ncgen genConf

// Example:
$ ncgen genConf -n ncgen-config.js
```

- Build project scaffolding
```bash
ncgen <configuration file path>

// Example:
$ ncgen /path/to/ncgen-config.js
$ ncgen https://<host path>/ncgen-config.js
```

- Subcommand to insert or modify project files
```bash
$ ncgen <configuration file path>::<subcommand>

// Example:
Examples:
$ ncgen /path/to/ncgen-config.js::add-api
$ ncgen https://<domain>/ncgen-config.js::add-api
```

> Use `ncgen <configuration file path>::help` to see all valid subcommands

## ncgen config

Refer to [config-template.js](https://github.com/daniel-dx/ncgen/blob/master/packages/ncgen/src/config-template.js)

## Answer value

The prop value can be a function. In the function, the value of answer can be obtained through `this.$answers`. Each string type answer has a prop with a suffix of `Obj` by default, which is a object contains multiple formats of the answer value. For example

```
// If your prompt is as follows

prompt: [
  {
    type: "input",
    name: "name",
    message: "What is your name",
  },
]

// You can give a function to `updateFiles` prop

updateFiles() {
  // Here you can access the answer values
  const answers = this.$answers
  return {
    "package.json": function(content) {
      return ncgenApi.replace(content, {
        'daniel': answers.nameObj.title
      })
    }
  }
}

// If the name's answer value is "demo name", all its format values are as follows:
{
  "kebabCase": "demo-name",
  "camelCase": "demoName",
  "upperFirstCamelCase": "DemoName",
  "title": "Demo Name",
  "humanized": "Demo name"
}
```

## Features

- 模板生态：所有现存的项目不需要任何改造即可作为模板，生态丰富
- 代码生成配置文件：可以URL，也可以是npm包
- 项目脚手架生成器默认有 {projectName} 值，所以开发者不需额外提供
- TODO

## API

```
import { api, log, _ } from "ncgen";
```

### api.transformStr

- params
  - str: The string to be transform

- return
```
// api.transformStr('demo name') result: 
{
  "kebabCase": "demo-name",
  "camelCase": "demoName",
  "upperFirstCamelCase": "DemoName",
  "title": "Demo Name",
  "humanized": "Demo name"
}
```

### api.replace

- params
    - content: What to replace
    - rules: replace rules  
      format: {'regex string': 'string'} or [[regix, 'string']]

- return
    Replaced content

- examples
```
api.replace('hello world', {
  'hello': 'hi',
  'world': 'daniel'
})
// return: hi daniel

api.replace('hello world', [
  [/hello/, 'hi'], 
  [/world/, 'daniel']
])
// return: hi daniel
```

### api.insertBefore

- params
    - content: What to insert
    - rules: insert rules  
      format: {'string': 'string'}

- return
    Inserted content

- examples
```
api.insertBefore('hello world', {
  'hello world': 'hi daniel',
})
// return: hi daniel\nhello world
```

> Note: the key of the rule does not support regular expressions

### api.insertAfter

- params
    - content: What to insert
    - rules: insert rules  
      format: {'string': 'string'}

- return
    Inserted content

- examples
```
api.insertAfter('hi daniel\nhi ncgen', {
  "hi ncgen": "hello daniel"
})
// return: "hi daniel\nhello daniel\nhi ncgen"
```

> Note: the key of the rule does not support regular expressions

### api.listDirs

- params
  - dirPath: Your target project dir path
  - excludes: exclude dirs

- return
    dir list

### api.listFiles

- params
  - dirPath: Your target project dir path
  - excludes: exclude files

- return
    file list

### log.info

```
log.info('message')
```

### log.warn
```
log.warn('message')
```

### log.error
```
log.error('message')
```

### log.success
```
log.success('message')
```

### _

Refer to [lodash document](https://lodash.com/docs)

## Develop

```bash
$ yarn install
$ DEBUG=ncgen node ./packages/ncgen/bin/ncgen
```

## Release

```bash
$ npm run release
```
