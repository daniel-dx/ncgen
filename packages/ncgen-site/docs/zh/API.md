
# API

```js
const { generate } = require("ncgen"); // or import { generate } from "ncgen"
```

<a name="generate"></a>

## generate(config, options) ⇒ <code>promise</code>
Call ncgen through node api form


**Returns**: <code>promise</code> - Promise  
**Params**

- config <code>string</code> | <code>object</code> - Configuration file path or configuration object
- options <code>object</code> - Options
    - .type <code>string</code> - "m" (main command) or "s" (subcommand)
    - .command <code>string</code> - The name of the executed subcommand. Only needed when type is "s"
    - .answers <code>object</code> - Provided when you want to skip interactive questioning

**Example**  
```js
const { generate } = require("ncgen"); // or import { generate } from "ncgen"

// Execute the main command
generate('path/to/ncgen-config.js', { type: 'm' })
// or
const ncgenConfig = require('path/to/ncgen-config.js')
generate(ncgenConfig, { type: 'm' })

// Execute the main command with answer data
generate('path/to/ncgen-config.js', { type: 'm', answers: { projectName: 'demo', author: 'daniel' } })

// Execute the sub command
generate('path/to/ncgen-config.js', { type: 's', command: 'add-component' })

// Execute the sub command with answer data
generate('path/to/ncgen-config.js', { type: 's', command: 'add-component', answers: { category: 'busi', name: 'hello world' } })
```

## api

### transformStr(str) ⇒ <code>object</code>
Convert input string into a variety of commonly used formats


**Returns**: <code>object</code> - Strings in a variety of commonly used formats  
**Params**

- str <code>string</code> - Input string.

**Example**  
```js
api.transformStr('demo-name')
api.transformStr('demoName')
api.transformStr('DemoName')
api.transformStr('Demo Name')
api.transformStr('Demo name')
api.transformStr('demo_name')

// returns:
{
  "kebabCase": "demo-name",
  "camelCase": "demoName",
  "snakeCase": "demo_name",
  "upperFirstCamelCase": "DemoName",
  "title": "Demo Name",
  "humanized": "Demo name"
}
```
<a name="replace"></a>

### replace(content, rules) ⇒ <code>string</code>
Replacement method that can process multiple replacement rules at the same time


**Returns**: <code>string</code> - Replaced content  
**Params**

- content <code>string</code> - What's replaced
- rules <code>object</code> | <code>array</code> - Multiple replacement rules. Object format: {"regular expression": "replace to"]}; Array format: [[/regular expression/, 'replace to']]

**Example**  
```js
const content = "ncgen is a very niice coded generator";
api.replace(content, {
  "\\sniice\\s": " nice ",
  coded: "code",
});
api.replace(content, [
  [/\sniice\s/, " nice "],
  ["coded", "code"],
]);

// returns
ncgen is a very nice code generator
```
<a name="insertBefore"></a>

### insertBefore(content, rules) ⇒ <code>string</code>
Batch processing: insert the specified string into the previous line of the specified matching string
Note: only string matching, does not support regular expressions


**Returns**: <code>string</code> - The content containing the inserted string  
**Params**

- content <code>string</code> - Content being processed
- rules <code>object</code> - Insert rules. Data format: {"matched string": "inserted string"}

**Example**  
```js
const content = "a\nc\ne";
const result = api.insertBefore(content, {
  c: "b",
  e: "d",
});

// returns
a
b
c
d
e
```
<a name="insertAfter"></a>

### insertAfter(content, rules) ⇒ <code>string</code>
Batch processing: insert the specified string into the next line of the specified matching string
Note: only string matching, does not support regular expressions


**Returns**: <code>string</code> - The content containing the inserted string  
**Params**

- content <code>string</code> - Content being processed
- rules <code>object</code> - Insert rules. Data format: {"matched string": "inserted string"}

**Example**  
```js
const content = "a\nc\ne";
const result = api.insertAfter(content, {
  a: "b",
  c: "d",
});

// returns
a
b
c
d
e
```
<a name="listDirs"></a>

### listDirs(dirPath, [excludes]) ⇒ <code>Array.&lt;string&gt;</code>
List the directory name of the specified path


**Returns**: <code>Array.&lt;string&gt;</code> - directory name list  
**Params**

- dirPath <code>string</code> - Specify the path
- [excludes] <code>Array.&lt;string&gt;</code> | <code>function</code> - Excluded directory name

**Example**  
```js
// Assuming your project directory structure is
.
├── bin
├── node_modules
├── src
├── test
└── package.json

api.listDirs("./");
// returns
["bin", "node_modules", "src", "test"]

api.listDirs("./", ["bin", "node.*"]);
// returns
["src", "test"]

api.listDirs(
  "./",
  (dir) => ["node_modules", "bin"].indexOf(dir) >= 0
);
// returns
["src", "test"]
```
<a name="listFiles"></a>

### listFiles(dirPath, [excludes]) ⇒ <code>Array.&lt;string&gt;</code>
List the file name of the specified path


**Returns**: <code>Array.&lt;string&gt;</code> - file name list  
**Params**

- dirPath <code>string</code> - Specify the path
- [excludes] <code>Array.&lt;string&gt;</code> | <code>function</code> - Excluded file name

**Example**  
```js
// Assuming your project directory structure is
.
├── bin
├── node_modules
├── src
├── jest.config.js
├── README.md
├── package-lock.json
└── package.json

api.listFiles("./");
// returns
["jest.config.js", "README.md", "package-lock.json", "package.json"]

api.listFiles("./", ["package-lock.*", "README.md"]);
// returns
["jest.config.js", "package.json"]

api.listFiles(
  "./",
  (file) => ["package-lock.json", "README.md"].indexOf(file) >= 0
);
// returns
["jest.config.js", "package.json"]
```

## log

### info(msg)

Print information in white

### success(msg)

Print information in green

### warn(msg)

Print information in yellow

### error(msg)

Print information in red

## _ - lodash

Refer to [lodash](https://lodash.com/docs/)
