const jsdoc2md = require("jsdoc-to-markdown");
const fs = require("fs-extra");
const path = require("path");

jsdoc2md
  .render({
    files: path.resolve("../ncgen/src/api.js"),
    "heading-depth": 3,
    "param-list-format": "list",
  })
  .then(mdContent => {
    mdContent = mdContent.replace(/\*\*Kind\*\*:.*/g, ""); // rm Kind
    mdContent = mdContent.replace(/### Functions[\s\S]*?###/, '###') // rm Functions catalog

    const apiDocs = ["./docs/zh/API.md", "./docs/API.md"];
    apiDocs.forEach(apiDoc => {
      let apiDocConent = fs.readFileSync(path.resolve(apiDoc), "utf-8");
      apiDocConent = apiDocConent.replace(
        /## api[\s\S]*## log/,
        `## api\n\n${mdContent}\n## log`
      );
      fs.writeFileSync(apiDoc, apiDocConent, "utf-8");
    });
  });
