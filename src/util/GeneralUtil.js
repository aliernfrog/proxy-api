import { readdirSync, statSync } from "fs";

export function listFilesRecursively(path) {
  let files = [];
  readdirSync(path).forEach(file => {
    const absolute = `${path}/${file}`;
    if (statSync(absolute).isDirectory()) files = files.concat(
      listFilesRecursively(absolute)
    );
    else files.push(absolute);
  });
  return files;
}

export function tryParseJson(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return {};
  }
}