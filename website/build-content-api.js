/** Build content.json API export from site-data files */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = __dirname;
const files = ["site-data.js", "site-data-extra.js", "site-data-v3.js"];
const sandbox = {};
const ctx = vm.createContext(sandbox);

files.forEach((f) => {
  const code = fs.readFileSync(path.join(ROOT, f), "utf8");
  vm.runInContext(code, ctx);
});

const out = {
  site: sandbox.SITE,
  beginnerPath: sandbox.BEGINNER_PATH,
  intermediatePath: sandbox.INTERMEDIATE_PATH,
  videos: sandbox.VIDEO_CATALOG,
  glossary: { llm: sandbox.GLOSSARY_LLM, ml: sandbox.GLOSSARY_ML },
  caseStudies: sandbox.CASE_STUDIES,
  blog: sandbox.BLOG_POSTS,
  updated: new Date().toISOString().slice(0, 10),
};

fs.writeFileSync(path.join(ROOT, "content.json"), JSON.stringify(out, null, 2));
console.log("Wrote content.json");
