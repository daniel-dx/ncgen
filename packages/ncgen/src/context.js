import path from "path";
import os from "os";
import { transformStr } from "./api";
import _ from "lodash";

export const homePath = path.resolve(os.homedir(), ".ncgen");

export const answers = {
  projectName: ""
};

export const data = {
  isSub: false,
  cwd: '.',
  projectDirName: null
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
    data.cwd,
    !data.isSub ? (data.projectDirName || transformStr(answers.projectName)["kebabCase"]) : ""
  );
}

export function getLocationOfTheProjectClone() {
  return !data.isSub
    ? getProjectRootPath()
    : path.resolve(homePath, "temp_clone");
}

export function getLocationOfArchive() {
  return path.resolve(homePath, "temp_archive")
}

export function initContext() {
  Object.keys(answers).forEach(key => delete answers[key]);
  answers.projectName = "";
  data.isSub = false;
  data.cwd = '.';
  data.projectDirName = null;
}
