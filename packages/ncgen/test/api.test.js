// require = require("esm")(module /*, options*/);

const { transformStr } = require("../src/api");

test("transformStr", () => {
  const inputs = [
    "demo-name",
    "demoName",
    "DemoName",
    "Demo Name",
    "Demo name",
  ];
  inputs.forEach((input) => {
    const result = transformStr(input);
    expect(result).toEqual({
      kebabCase: "demo-name",
      camelCase: "demoName",
      upperFirstCamelCase: "DemoName",
      title: "Demo Name",
      humanized: "Demo name",
    });
  });
});
