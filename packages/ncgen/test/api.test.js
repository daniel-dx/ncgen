// require = require("esm")(module /*, options*/);

const { transformStr, replace } = require("../src/api");

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
});
