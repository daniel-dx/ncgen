// require = require("esm")(module /*, options*/);

const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs-extra");
const {
  ncgen,
  transformStr,
  replace,
  listDirs,
  insertBefore,
  insertAfter,
  listFiles,
  CommandType
} = require("../src/api");

test("transformStr", () => {
  const inputs = [
    "demo-name",
    "demoName",
    "DemoName",
    "Demo Name",
    "Demo name",
    "demo_name"
  ];
  inputs.forEach(input => {
    const result = transformStr(input);
    expect(result).toEqual({
      kebabCase: "demo-name",
      camelCase: "demoName",
      snakeCase: "demo_name",
      upperFirstCamelCase: "DemoName",
      title: "Demo Name",
      humanized: "Demo name"
    });
  });
});

test("replace", () => {
  const content = "ncgen is a very niice coded generator";
  const result = replace(content, {
    "\\sniice\\s": " nice ",
    coded: "code"
  });
  const result1 = replace(content, [
    [/\sniice\s/, " nice "],
    ["coded", "code"]
  ]);
  expect(result).toBe("ncgen is a very nice code generator");
  expect(result1).toBe("ncgen is a very nice code generator");

  const content2 = "ncgen is a veri veri nice code generator";
  const result2 = replace(content2, {
    veri: "very"
  });
  const result3 = replace(content2, [["veri", "very"]]);
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
    dir => ["node_modules", "bin"].indexOf(dir) >= 0
  );
  expect(dirs2).toEqual(["src", "test"]);
});

test("listFiles", () => {
  const rootPath = path.resolve(__dirname, "../");
  const files = listFiles(rootPath, ["package-lock.*", "README.md"]);
  expect(files).toEqual(["jest.config.js", "jest.setup.js", "package.json"]);

  const files2 = listFiles(
    rootPath,
    file => ["package-lock.json", "README.md"].indexOf(file) >= 0
  );
  expect(files2).toEqual(["jest.config.js", "jest.setup.js", "package.json"]);
});

test("insertBefore", () => {
  const content = "a\nc\ne";
  const result = insertBefore(content, {
    c: "b",
    e: "d"
  });
  expect(result).toEqual("a\nb\nc\nd\ne");
});

test("insertAfter", () => {
  const content = "a\nc\ne";
  const result = insertAfter(content, {
    a: "b",
    c: "d"
  });
  expect(result).toEqual("a\nb\nc\nd\ne");
});

function expectFileExist(filePath, isExist) {
  expect(fs.existsSync(filePath)).toEqual(isExist);
}
function expectFileContain(filePath, keywords) {
  const content = fs.readFileSync(filePath, "utf-8");
  keywords.forEach(kw => {
    expect(content.search(kw) !== -1).toEqual(true);
  });
}

describe("ncgen", () => {
  // stub inquirer
  let backup;
  function getGenProjectInfo(idx) {
    const projectName = `test-demo-${idx}`;
    return {
      name: projectName,
      path: path.resolve(__dirname, projectName)
    };
  }
  let ncgenConfigPath = path.resolve(__dirname, "./test-ncgen-config.js");
  let ncgenConfig = require(path.resolve(__dirname, "./test-ncgen-config.js"));

  beforeEach(() => {
    backup = inquirer.prompt;
    process.chdir(__dirname);
  });

  it(`ncgen: handle ncgen-config.js and no answers`, async () => {
    let { path: genProjectPath, name: projectName } = getGenProjectInfo(1);

    inquirer.prompt = questions =>
      Promise.resolve({ projectName, author: "daniel" });
    await ncgen(ncgenConfigPath, {
      type: CommandType.MAIN
    });

    expectFileContain(path.resolve(genProjectPath, "package.json"), [
      `"name": "test-demo-1"`,
      `"author": "daniel"`
    ]);
    expectFileExist(path.resolve(genProjectPath, "ncgen-config.js"), false);
    expectFileExist(
      path.resolve(genProjectPath, "src/components/base/Template.vue"),
      false
    );
    expectFileExist(path.resolve(genProjectPath, "package.json"), true);

    process.chdir(genProjectPath);
    inquirer.prompt = questions =>
      Promise.resolve({ category: "busi", name: "hello ncgen" });
    await ncgen(ncgenConfigPath, {
      type: CommandType.SUB,
      command: "add-component"
    });
    expectFileExist(
      path.resolve(genProjectPath, "src/components/busi/HelloNcgen.vue"),
      true
    );
    expectFileExist(
      path.resolve(genProjectPath, "src/components/busi/HelloNcgen.md"),
      true
    );
    expectFileContain(
      path.resolve(genProjectPath, "src/components/busi/HelloNcgen.md"),
      [`# HelloNcgen`]
    );
    expectFileContain(path.resolve(genProjectPath, "src/App.vue"), [
      `<HelloNcgen/>`,
      `import HelloNcgen from './components/busi/HelloNcgen.vue'`,
      `HelloNcgen,`
    ]);
    expectFileContain(
      path.resolve(genProjectPath, "src/components/busi/HelloNcgen.vue"),
      [`HelloNcgen Component`, `name: "HelloNcgen",`]
    );

    fs.removeSync(genProjectPath);
  });

  it(`ncgen: handle ncgen-config.js and answers`, async () => {
    let { path: genProjectPath, name: projectName } = getGenProjectInfo(2);

    await ncgen(ncgenConfigPath, {
      type: CommandType.MAIN,
      answers: { projectName, author: "daniel" }
    });

    expectFileContain(path.resolve(genProjectPath, "package.json"), [
      `"name": "test-demo-2"`,
      `"author": "daniel"`
    ]);
    expectFileExist(path.resolve(genProjectPath, "ncgen-config.js"), false);
    expectFileExist(
      path.resolve(genProjectPath, "src/components/base/Template.vue"),
      false
    );
    expectFileExist(path.resolve(genProjectPath, "package.json"), true);

    process.chdir(genProjectPath);
    await ncgen(ncgenConfigPath, {
      type: CommandType.SUB,
      command: "add-component",
      answers: { category: "busi", name: "hello ncgen" }
    });
    expectFileExist(
      path.resolve(genProjectPath, "src/components/busi/HelloNcgen.vue"),
      true
    );
    expectFileExist(
      path.resolve(genProjectPath, "src/components/busi/HelloNcgen.md"),
      true
    );
    expectFileContain(
      path.resolve(genProjectPath, "src/components/busi/HelloNcgen.md"),
      [`# HelloNcgen`]
    );
    expectFileContain(path.resolve(genProjectPath, "src/App.vue"), [
      `<HelloNcgen/>`,
      `import HelloNcgen from './components/busi/HelloNcgen.vue'`,
      `HelloNcgen,`
    ]);
    expectFileContain(
      path.resolve(genProjectPath, "src/components/busi/HelloNcgen.vue"),
      [`HelloNcgen Component`, `name: "HelloNcgen",`]
    );

    fs.removeSync(genProjectPath);
  });

  it(`ncgen: handle ncgen-config object`, async () => {
    let { path: genProjectPath, name: projectName } = getGenProjectInfo(3);

    inquirer.prompt = questions =>
      Promise.resolve({ projectName, author: "daniel" });
    await ncgen(ncgenConfig, {
      type: CommandType.MAIN
    });

    expectFileContain(path.resolve(genProjectPath, "package.json"), [
      `"name": "test-demo-3"`,
      `"author": "daniel"`
    ]);
    expectFileExist(path.resolve(genProjectPath, "ncgen-config.js"), false);
    expectFileExist(
      path.resolve(genProjectPath, "src/components/base/Template.vue"),
      false
    );
    expectFileExist(path.resolve(genProjectPath, "package.json"), true);

    process.chdir(genProjectPath);
    inquirer.prompt = questions =>
      Promise.resolve({ category: "busi", name: "hello ncgen" });
    await ncgen(ncgenConfig, {
      type: CommandType.SUB,
      command: "add-component"
    });
    expectFileExist(
      path.resolve(genProjectPath, "src/components/busi/HelloNcgen.vue"),
      true
    );
    expectFileExist(
      path.resolve(genProjectPath, "src/components/busi/HelloNcgen.md"),
      true
    );
    expectFileContain(
      path.resolve(genProjectPath, "src/components/busi/HelloNcgen.md"),
      [`# HelloNcgen`]
    );
    expectFileContain(path.resolve(genProjectPath, "src/App.vue"), [
      `<HelloNcgen/>`,
      `import HelloNcgen from './components/busi/HelloNcgen.vue'`,
      `HelloNcgen,`
    ]);
    expectFileContain(
      path.resolve(genProjectPath, "src/components/busi/HelloNcgen.vue"),
      [`HelloNcgen Component`, `name: "HelloNcgen",`]
    );

    fs.removeSync(genProjectPath);
  });

  // restore
  afterEach(() => {
    inquirer.prompt = backup;
  });
});
