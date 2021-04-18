<p align="center">
  <a href="https://daniel-dx.github.io/ncgen" target="_blank">
    <img width="180" src="https://daniel-dx.github.io/ncgen/logo.png" alt="logo">
    <h1 align="center">A very nice code generator</h1>
  </a>
</p>


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
  "snakeCase": "demo_name",
  "upperFirstCamelCase": "DemoName",
  "title": "Demo Name",
  "humanized": "Demo name"
}
```

## Develop

```bash
$ yarn install
$ DEBUG=ncgen node ./packages/ncgen/bin/ncgen
```

## Release

```bash
$ npm run release
```
