// require = require("esm")(module /*, options*/);

const path = require("path");
const {
  transformStr,
  replace,
  listDirs,
  insertBefore,
  insertAfter,
  listFiles,
} = require("../src/api");

test("transformStr", () => {
  const inputs = [
    "demo-name",
    "demoName",
    "DemoName",
    "Demo Name",
    "Demo name",
    "demo_name",
  ];
  inputs.forEach((input) => {
    const result = transformStr(input);
    expect(result).toEqual({
      kebabCase: "demo-name",
      camelCase: "demoName",
      snakeCase: "demo_name",
      upperFirstCamelCase: "DemoName",
      title: "Demo Name",
      humanized: "Demo name",
    });
  });
});

test("replace", () => {
  const content = "ncgen is a very niice coded generator";
  const result = replace(content, {
    "\\sniice\\s": " nice ",
    coded: "code",
  });
  const result1 = replace(content, [
    [/\sniice\s/, " nice "],
    ["coded", "code"],
  ]);
  expect(result).toBe("ncgen is a very nice code generator");
  expect(result1).toBe("ncgen is a very nice code generator");

  const content2 = "ncgen is a veri veri nice code generator";
  const result2 = replace(content2, {
    veri: "very",
  });
  const result3 = replace(content2, [
    ["veri", "very"],
  ]);
  expect(result2).toBe("ncgen is a very very nice code generator");
  expect(result3).toBe("ncgen is a very very nice code generator");
});

test("listDirs", () => {
  const rootPath = path.resolve(__dirname, "../");
  const dirs = listDirs(rootPath);
  expect(dirs).toEqual(["bin", "node_modules", "src", "test"]);

  const dirs1 = listDirs(rootPath, ["bin", "node.*"]);
  expect(dirs1).toEqual(["src", "test"]);

  const dirs2 = listDirs(
    rootPath,
    (dir) => ["node_modules", "bin"].indexOf(dir) >= 0
  );
  expect(dirs2).toEqual(["src", "test"]);
});

test("listFiles", () => {
  const rootPath = path.resolve(__dirname, "../");
  const files = listFiles(rootPath, ["package-lock.*", "README.md"]);
  expect(files).toEqual(["jest.config.js", "package.json"]);

  const files2 = listFiles(
    rootPath,
    (file) => ["package-lock.json", "README.md"].indexOf(file) >= 0
  );
  expect(files2).toEqual(["jest.config.js", "package.json"]);
});

test("insertBefore", () => {
  const content = "a\nc\ne";
  const result = insertBefore(content, {
    c: "b",
    e: "d",
  });
  expect(result).toEqual("a\nb\nc\nd\ne");
});

test("insertAfter", () => {
  const content = "a\nc\ne";
  const result = insertAfter(content, {
    a: "b",
    c: "d",
  });
  expect(result).toEqual("a\nb\nc\nd\ne");
});
