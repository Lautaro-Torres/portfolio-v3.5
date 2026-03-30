#!/usr/bin/env node
/**
 * Extracts a frame from each gallery video as a poster image.
 * Requires ffmpeg to be installed (e.g. choco install ffmpeg).
 *
 * Usage: node scripts/extract-video-posters.js
 *
 * For each gallery video without a poster, extracts a frame at posterTime (default 1s)
 * and saves it as {video-basename}-poster.webp next to the video.
 * Then updates src/data/projects.js to add the poster path.
 */

const { readFileSync, writeFileSync, existsSync } = require("fs");
const { join } = require("path");
const { execSync } = require("child_process");

const root = join(__dirname, "..");
const publicDir = join(root, "public");
const dataPath = join(root, "src", "data", "projects.js");

// Parse projects.js to find gallery videos (file uses export, can't require)
const content = readFileSync(dataPath, "utf-8");
const videoSrcRegex = /src:\s*"(\/assets\/[^"]+\.(?:mp4|webm))"/g;
const videos = [];
let m;
while ((m = videoSrcRegex.exec(content)) !== null) {
  const src = m[1];
  if (src.includes("/gallery/")) videos.push({ src });
}

const updates = [];

for (const { src } of videos) {
  // Skip if poster already exists in the file for this src
  const posterRegex = new RegExp(`src:\\s*"${src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^}]*poster:\\s*"`);
  if (posterRegex.test(content)) continue;

  const srcNorm = src.startsWith("/") ? src.slice(1) : src;
    const videoPath = join(publicDir, srcNorm);
    const posterTime = 1;
    const base = srcNorm.replace(/\.[^.]+$/, "");
    const posterPath = `${base}-poster.webp`;
    const posterFullPath = join(publicDir, posterPath);

    if (!existsSync(videoPath)) {
      console.warn(`Video not found: ${videoPath}`);
      continue;
    }

    try {
      execSync(
        `ffmpeg -y -i "${videoPath}" -ss ${posterTime} -vframes 1 -q:v 2 "${posterFullPath}"`,
        { stdio: "pipe" }
      );
      console.log(`Extracted: ${posterPath}`);
      updates.push({ src, posterPath: "/" + posterPath });
    } catch (err) {
      console.error(`Failed to extract from ${videoPath}:`, err.message);
    }
}

if (updates.length === 0) {
  console.log("No videos needed poster extraction (all have poster or none found).");
  process.exit(0);
}

// Update projects.js to add poster paths
let content = readFileSync(dataPath, "utf-8");

for (const { src, posterPath } of updates) {
  const escapedSrc = src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Add poster after src (only if not already present)
  const srcOnlyPattern = new RegExp(
    `(src:\\s*"${escapedSrc}")(\\s*)(,)(?!\\s*poster:)`,
    "g"
  );
  content = content.replace(srcOnlyPattern, `$1$2, poster: "${posterPath}"$2$3`);
}

writeFileSync(dataPath, content);
console.log(`Updated ${dataPath} with ${updates.length} poster paths.`);
