import _ from "lodash";

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
