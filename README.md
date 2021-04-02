# ncgen
A very nice code generator


## 一些记录

- 利用 [degit](https://github.com/Rich-Harris/degit) 来下载项目
- 模板生态：所有现存的项目不需要任何改造即可作为模板，生态丰富
- 代码生成配置文件：可以URL，也可以是npm包
- 项目脚手架生成器默认有 {projectName} 值，所以开发者不需额外提供

## Develop

```
$ yarn install
```

## 查看调试信息

```
$ DEBUG=ncgen node ./packages/ncgen/bin/ncgen
```
