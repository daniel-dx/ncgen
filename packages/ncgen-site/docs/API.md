
# API

```
import { api, log, _ } from "ncgen";
```

## api

### transformStr(str) ⇒ <code>object</code>
Convert input string into a variety of commonly used formats


**Returns**: <code>object</code> - Strings in a variety of commonly used formats  
**Params**

- str <code>string</code> - Input string.

**Example**  
```js
transformStr('demo-name')
transformStr('demoName')
transformStr('DemoName')
transformStr('Demo Name')
transformStr('Demo name')
transformStr('demo_name')

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
replace(content, {
  "\\sniice\\s": " nice ",
  coded: "code",
});
replace(content, [
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
const result = insertBefore(content, {
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
const result = insertAfter(content, {
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

listDirs("./");
// returns
["bin", "node_modules", "src", "test"]

listDirs("./", ["bin", "node.*"]);
// returns
["src", "test"]

listDirs(
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

listFiles("./");
// returns
["jest.config.js", "README.md", "package-lock.json", "package.json"]

listFiles("./", ["package-lock.*", "README.md"]);
// returns
["jest.config.js", "package.json"]

listFiles(
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
