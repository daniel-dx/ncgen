import _ from "lodash";
import path from "path";
import fs from "fs-extra";
import { getProjectRootPath } from "./context";

/**
 * 例子：transformStr('demo-name') or transformStr('demoName') or transformStr('DemoName') or transformStr('Demo Name') or transformStr('Demo name')
 * 返回：
 * {
 *   "kebabCase": "demo-name",
 *   "camelCase": "demoName",
 *   "upperFirstCamelCase": "DemoName",
 *   "title": "Demo Name",
 *   "humanized": "Demo name"
 * }
 */
export function transformStr(str) {
  const words = _.words(str);
  const wordsStr = words.join(" ");
  const camelCase = _.camelCase(wordsStr);
  const upperFirstCamelCase = _.upperFirst(camelCase);
  return {
    kebabCase: _.kebabCase(wordsStr), // "demo-name"
    camelCase, // "demoName"
    upperFirstCamelCase, // "DemoName"
    title: _.words(upperFirstCamelCase).join(" "), // "Demo Name"
    humanized: words
      .map((word, idx) => {
        if (idx === 0) return _.upperFirst(word);
        return _.lowerCase(word);
      })
      .join(" "), // "Demo name"
  };
}

/**
 * 可指定多个替换规则的替换方法
 * @param content 被替换的内容
 * @param rules 多个替换规则 {[替换规则]: [替换后的新内容]} or [['替换规则', '替换后的新内容']]
 */
export function replace(content, rules) {
  let result = content;
  if (_.isArray(rules)) {
    rules.forEach((item) => {
      const [rule, val] = item;
      result = result.replace(new RegExp(rule), val);
    });
  } else if (_.isObject(rules)) {
    Object.keys(rules).forEach((rule) => {
      result = result.replace(new RegExp(rule), rules[rule]);
    });
  }

  return result;
}

export function listDirs(dirPath, excludes) {
  const targetDir = path.resolve(getProjectRootPath(), dirPath);
  let allDirs = fs
    .readdirSync(targetDir)
    .filter((name) => fs.statSync(path.resolve(targetDir, name)).isDirectory());
  if (_.isArray(excludes)) {
    allDirs = allDirs.filter(
      (dir) => !excludes.some((eItem) => new RegExp(eItem).test(dir))
    );
  } else if (_.isFunction(excludes)) {
    allDirs = allDirs.filter((dir) => !excludes(dir));
  }
  return allDirs;
}
