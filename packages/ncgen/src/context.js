import path from "path";
import os from "os";
import { transformStr } from "./api";

export const homePath = path.resolve(os.homedir(), ".ncgen");

export const answers = {
  projectName: "",
};

export const data = {
  isSub: false,
};

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
