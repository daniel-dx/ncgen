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

export function insertBefore(content, rules) {
  let result = content;
  Object.keys(rules).forEach((rule) => {
    result = rewrite({
      haystack: result,
      splicable: [rules[rule]],
      needle: rule,
      isAppend: false,
      appendAfter: true,
      insertPrev: true,
    });
  });

  return result;
}

export function insertAfter(content, rules) {
  let result = content;
  Object.keys(rules).forEach((rule) => {
    result = rewrite({
      haystack: result,
      splicable: [rules[rule]],
      needle: rule,
      isAppend: false,
      appendAfter: true,
      insertPrev: false,
    });
  });

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

/**
 * 根据标识定位位置，并将提供的内容追加到该位置
 *
 * @param {
 *  haystack, // 要处理的内容
 *  splicable, // 追加的内容, 是数组类型，如['', '']。当isAppend=true时，数组中的字符串项会串连成一行；当isAppend=false时，数组中的每一项字符串都会以换行符拼接起来
 *  needle, // 查找的标识
 *  isAppend, // 是否追加到该行，默认是false
 *  appendAfter, // 追加到该行的位置，是插入行首还是行尾。默认是行尾。只有isAppend为true时有效。
 *  insertPrev // 是否插入到该行的前端还是后面。默认是后面。只有isAppend为false时有效
 * }
 *
 * @returns string 处理过后的内容
 */
function rewrite({
  haystack,
  splicable,
  needle,
  isAppend = false,
  appendAfter = true,
  insertPrev = false,
}) {
  function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }

  // Check if splicable is already in the body text
  const re = new RegExp(
    splicable.map((line) => "s*" + escapeRegExp(line)).join("\n")
  );

  if (re.test(haystack)) {
    return haystack;
  }

  const lines = haystack.split("\n");

  let otherwiseLineIndex = 0;
  lines.forEach((line, i) => {
    if (line.indexOf(needle) !== -1) {
      otherwiseLineIndex = i;
    }
  });

  let spaces = 0;
  while (lines[otherwiseLineIndex].charAt(spaces) === " ") {
    spaces += 1;
  }

  let spaceStr = "";
  while ((spaces -= 1) >= 0) {
    spaceStr += " ";
  }

  /**
   * 追加到该行的开始部分: isAppend=true appendAfter=true
   * 追加到该行的末尾部分: isAppend=true appendAfter=false
   * 插入到该行的前面一行: insertPrev=true
   * 追加到该行的后面一行: insertPrev=false default
   */
  if (isAppend) {
    // 追回到该行
    if (appendAfter) {
      lines[otherwiseLineIndex] += splicable.join("");
    } else {
      lines[otherwiseLineIndex] =
        splicable.join("") + lines[otherwiseLineIndex];
    }
  } else {
    // 插入新行
    const n = insertPrev ? 0 : 1;
    lines.splice(
      otherwiseLineIndex + n,
      0,
      splicable.map((line) => spaceStr + line).join("\n")
    );
  }

  return lines.join("\n");
}
