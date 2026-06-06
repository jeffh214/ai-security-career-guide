#!/usr/bin/env node
/** Validate external URLs in site-data files. Run: node check-links.js */
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const files = ["site-data.js", "site-data-extra.js", "site-data-v3.js", "site-data-v4.js", "site-data-v5.js"];
const urlRe = /https?:\/\/[^\s"'<>\\)]+/g;

function fetchHead(url) {
  return new Promise((resolve) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.request(url, { method: "HEAD", timeout: 8000 }, (res) => {
      resolve({ url, status: res.statusCode });
    });
    req.on("error", () => resolve({ url, status: "ERR" }));
    req.on("timeout", () => { req.destroy(); resolve({ url, status: "TIMEOUT" }); });
    req.end();
  });
}

async function main() {
  const urls = new Set();
  for (const f of files) {
    const content = fs.readFileSync(path.join(__dirname, f), "utf8");
    (content.match(urlRe) || []).forEach((u) => urls.add(u.replace(/[.,;]+$/, "")));
  }

  console.log(`Checking ${urls.size} unique URLs...\n`);
  const results = [];
  for (const url of [...urls].slice(0, 40)) {
    results.push(await fetchHead(url));
    process.stdout.write(".");
  }
  console.log("\n");
  const bad = results.filter((r) => !r.status || r.status >= 400 || r.status === "ERR" || r.status === "TIMEOUT");
  if (bad.length) {
    console.log("Possible issues:");
    bad.forEach((r) => console.log(`  [${r.status}] ${r.url}`));
    process.exit(1);
  }
  console.log("Sample check passed (first 40 URLs).");
}

main().catch(console.error);
