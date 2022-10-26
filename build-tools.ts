import { execSync } from "child_process";

export const getGitVersion = () => {
  const OUTPUT = 1;
  return execSync(`git rev-parse --short HEAD`, {
    stdio: [OUTPUT],
  })
    .toString("utf8")
    .trim();
};
