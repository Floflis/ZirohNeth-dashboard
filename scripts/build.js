#!/usr/bin/env node
"use strict";

// Rebuild the checked-in browser bundle in the same explicit source order.
// Run with: npm ci && npm run build
// Verify without writing: npm run check:bundle
const fs = require("fs");
const path = require("path");
const CoffeeScript = require("coffee-script");

const root = path.resolve(__dirname, "..");
const output = path.join(root, "js", "all.js");
const sources = [
  "js/lib/Class.coffee",
  "js/lib/Promise.coffee",
  "js/lib/Property.coffee",
  "js/lib/Prototypes.coffee",
  "js/lib/maquette.js",
  "js/lib/marked.min.js",
  "js/PageFiles/Bigfiles.coffee",
  "js/PageFiles/FilesResult.coffee",
  "js/PageFiles/PageFiles.coffee",
  "js/PageFiles/SiteFiles.coffee",
  "js/PageSites/Dashboard.coffee",
  "js/PageSites/FeedList.coffee",
  "js/PageSites/MuteList.coffee",
  "js/PageSites/Site.coffee",
  "js/PageSites/SiteList.coffee",
  "js/PageSites/Trigger.coffee",
  "js/PageStats/Chart.coffee",
  "js/PageStats/ChartBig.coffee",
  "js/PageStats/ChartLegend.coffee",
  "js/PageStats/ChartRadar.coffee",
  "js/PageStats/ChartTimeline.coffee",
  "js/PageStats/ChartWorld.coffee",
  "js/PageStats/PageStats.coffee",
  "js/PageStats/StatList.coffee",
  "js/utils/Animation.coffee",
  "js/utils/Dollar.coffee",
  "js/utils/ItemList.coffee",
  "js/utils/Menu.coffee",
  "js/utils/Prototypes.coffee",
  "js/utils/RateLimit.coffee",
  "js/utils/RateLimitCb.coffee",
  "js/utils/Text.coffee",
  "js/utils/Time.coffee",
  "js/utils/Translate.coffee",
  "js/utils/ZeroFrame.coffee",
  "js/Head.coffee",
  "js/ZeroHello.coffee"
];

const bundle = sources.map((relative) => {
  const filename = path.join(root, relative);
  const source = fs.readFileSync(filename, "utf8");
  const body = path.extname(filename) === ".coffee"
    ? CoffeeScript.compile(source, { filename, bare: false })
    : source;
  return "/* ---- " + path.basename(relative) + " ---- */\n\n" + body;
}).join("\n\n");

if (process.argv.includes("--check")) {
  const current = fs.readFileSync(output, "utf8");
  if (current !== bundle) {
    process.stderr.write("js/all.js is stale. Run npm run build.\n");
    process.exit(1);
  }
  process.stdout.write("js/all.js matches CoffeeScript sources.\n");
} else {
  fs.writeFileSync(output, bundle);
  process.stdout.write("Built js/all.js from " + sources.length + " sources.\n");
}
