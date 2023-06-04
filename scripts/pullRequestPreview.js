import { execSync } from "child_process";
import fetch from "node-fetch";

console.log("[DEPLOY_PREVIEW]: START");
const command = "yarn deploy:staging";
const output = execSync(command, { encoding: "utf8" });
const outputLines = output.split("\n");
const DEPLOY_URL = outputLines.pop();
console.log("[DEPLOY_PREVIEW]: END");

console.log(`You can see the deploy preview on: ${DEPLOY_URL}`);

// =======================================
// =======================================

console.log("[GITHUB_COMMENT]: START");

const { GITHUB_TOKEN, GITHUB_REPOSITORY, GITHUB_PR_NUMBER } = process.env;

const GH_COMMENT = `
- Deploy URL: [${DEPLOY_URL}] (${DEPLOY_URL})
`;

console.log("GITHUB_REPOSITORY", GITHUB_REPOSITORY);
console.log("GITHUB_PR_NUMBER", GITHUB_PR_NUMBER);

const headers = {};
headers["authorization"] = `token ${GITHUB_TOKEN}`;
headers["accept"] =
  "application/vnd.github.v3+json; application/vnd.github.antiope-preview+json";
headers["content-type"] = "application/json";

const url = `https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${GITHUB_PR_NUMBER}/comments`;

fetch(url, {
  headers,
  method: "POST",
  body: JSON.stringify({
    body: GH_COMMENT,
  }),
})
  .then((response) => {
    console.log("[COMMENT_ON_GITHUB: START]");
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .catch((err) => {
    console.log("[COMMENT_ON_GITHUB: ERROR]");
    throw new Error(err);
  })
  .finally(() => {
    console.log("[COMMENT_ON_GITHUB: END]");
  });
