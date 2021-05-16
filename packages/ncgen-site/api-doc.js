const jsdoc2md = require("jsdoc-to-markdown");
const fs = require("fs-extra");
const path = require("path");

Promise.all([
  jsdoc2md.render({
    files: path.resolve("../ncgen/src/api.js"),
    "heading-depth": 3,
    "param-list-format": "list"
  }),
  jsdoc2md.render({
    files: path.resolve("../ncgen/src/index.js"),
    "heading-depth": 2,
    "param-list-format": "list"
  })
]).then(res => {
  res.forEach((mdContent, idx) => {
    mdContent = mdContent.replace(/\*\*Kind\*\*:.*/g, ""); // rm Kind
    mdContent = mdContent.replace(/### Functions[\s\S]*?###/, "###"); // rm Functions catalog
    mdContent = mdContent.replace(/## Functions[\s\S]*?##/, "##"); // rm Functions catalog

    const apiDocs = ["./docs/zh/API.md", "./docs/API.md"];
    apiDocs.forEach(apiDoc => {
      let apiDocConent = fs.readFileSync(path.resolve(apiDoc), "utf-8");
      if (idx === 0) {
        apiDocConent = apiDocConent.replace(
          /## api[\s\S]*## log/,
          `## api\n\n${mdContent}\n## log`
        );
      } else if (idx === 1) {
        apiDocConent = apiDocConent.replace(
          /<a name="generate"><\/a>[\s\S]*## api/,
          `${mdContent}\n## api`
        );
      }
      fs.writeFileSync(apiDoc, apiDocConent, "utf-8");
    });
  });
});
