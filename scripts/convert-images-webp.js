#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const fg = require("fast-glob");
const sharp = require("sharp");

const root = path.join(__dirname, "..");
const publicDir = path.join(root, "public");
const cwd = process.cwd();

const argTargets = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const includePatterns =
  argTargets.length > 0
    ? argTargets.map((entry) => {
        const normalized = entry.replace(/\\/g, "/");
        if (normalized.includes("*")) return normalized;
        return `${normalized.replace(/\/$/, "")}/**/*.{jpg,jpeg,png}`;
      })
    : ["public/**/*.{jpg,jpeg,png}"];

const force = process.argv.includes("--force");

const pbrPattern =
  /(normal|roughness|metalness|ao|ambientocclusion|height|displacement|gloss|glossiness|specular|orm|mask|opacity|alpha)/i;

function toPosix(filePath) {
  return filePath.replace(/\\/g, "/");
}

function asRelative(filePath) {
  return toPosix(path.relative(cwd, filePath));
}

function outputPathFor(inputPath) {
  const ext = path.extname(inputPath);
  return inputPath.slice(0, -ext.length) + ".webp";
}

async function shouldConvert(inputPath, outputPath) {
  if (force) return true;
  if (!fs.existsSync(outputPath)) return true;
  const inputStat = await fs.promises.stat(inputPath);
  const outputStat = await fs.promises.stat(outputPath);
  return inputStat.mtimeMs > outputStat.mtimeMs;
}

function webpOptionsFor(fileName) {
  if (pbrPattern.test(fileName)) {
    return { quality: 90, effort: 6 };
  }
  return { quality: 82, effort: 6 };
}

async function convertOne(filePath) {
  const outputPath = outputPathFor(filePath);
  const fileName = path.basename(filePath);
  const doConvert = await shouldConvert(filePath, outputPath);
  if (!doConvert) return { status: "skipped" };

  const options = webpOptionsFor(fileName);
  await sharp(filePath).webp(options).toFile(outputPath);

  const srcSize = (await fs.promises.stat(filePath)).size;
  const outSize = (await fs.promises.stat(outputPath)).size;

  // Keep .webp only when it improves transfer size.
  if (outSize >= srcSize) {
    await fs.promises.unlink(outputPath);
    return { status: "not-better", srcSize, outSize };
  }

  return {
    status: "converted",
    srcSize,
    outSize,
    outputPath,
  };
}

async function main() {
  if (!fs.existsSync(publicDir)) {
    console.error("public directory not found.");
    process.exit(1);
  }

  const files = await fg(includePatterns, {
    cwd: root,
    absolute: true,
    onlyFiles: true,
    ignore: ["**/*.webp", "**/.next/**", "**/node_modules/**"],
  });

  if (files.length === 0) {
    console.log("No jpg/png files found to convert.");
    return;
  }

  let converted = 0;
  let skipped = 0;
  let notBetter = 0;
  let totalIn = 0;
  let totalOut = 0;

  for (const filePath of files) {
    try {
      const result = await convertOne(filePath);
      if (result.status === "skipped") {
        skipped += 1;
        continue;
      }
      if (result.status === "not-better") {
        notBetter += 1;
        continue;
      }
      converted += 1;
      totalIn += result.srcSize;
      totalOut += result.outSize;
      const inKB = (result.srcSize / 1024).toFixed(1);
      const outKB = (result.outSize / 1024).toFixed(1);
      console.log(
        `converted ${asRelative(filePath)} -> ${asRelative(result.outputPath)} (${inKB}KB -> ${outKB}KB)`
      );
    } catch (error) {
      console.warn(`failed ${asRelative(filePath)}: ${error.message}`);
    }
  }

  const deltaPct = totalIn > 0 ? (((totalIn - totalOut) / totalIn) * 100).toFixed(1) : "0.0";
  console.log("");
  console.log(`Done. converted=${converted}, skipped=${skipped}, notBetter=${notBetter}`);
  if (converted > 0) {
    console.log(
      `Converted total: ${(totalIn / 1024 / 1024).toFixed(2)}MB -> ${(totalOut / 1024 / 1024).toFixed(2)}MB (${deltaPct}% smaller)`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
