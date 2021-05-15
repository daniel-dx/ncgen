import path from "path";
import os from "os";
import { transformStr } from "./api";
import _ from "lodash";

export const homePath = path.resolve(os.homedir(), ".ncgen");

export const answers = {
  projectName: ""
};

export const data = {
  isSub: false
};

export function getFnContext() {
  Object.keys(answers).forEach(field => {
    if (_.isString(answers[field])) {
      const objKey = `${field}Obj`;
      answers[objKey] = answers[objKey] || transformStr(answers[field]);
    }
  });
  return {
    $answers: answers
  };
}

export function getProjectRootPath() {
  return path.resolve(
    ".",
    !data.isSub ? transformStr(answers.projectName)["kebabCase"] : ""
  );
}

export function getLocationOfTheProjectClone() {
  return !data.isSub
    ? getProjectRootPath()
    : path.resolve(homePath, "temp_clone");
}

export function initContext() {
  Object.keys(answers).forEach(key => delete answers[key]);
  answers.projectName = "";
  data.isSub = false;
}
