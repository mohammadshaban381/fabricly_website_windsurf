import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const imagesDir = path.join(rootDir, 'public', 'images');

const QUALITY = Number(process.env.IMAGE_QUALITY || 82);
const MIN_BYTES = Number(process.env.IMAGE_MIN_BYTES || 60 * 1024);
const MAX_WIDTH = Number(process.env.IMAGE_MAX_WIDTH || 1920);
const SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);

let scanned = 0;
let converted = 0;
let skipped = 0;
let inputBytes = 0;
let outputBytes = 0;

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function listImageFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listImageFiles(fullPath));
      continue;
    }

    if (SOURCE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

async function shouldSkip(sourcePath, outputPath, sourceStat) {
  if (sourceStat.size < MIN_BYTES) return 'small source';
  if (!(await exists(outputPath))) return '';

  const outputStat = await fs.stat(outputPath);
  if (outputStat.mtimeMs >= sourceStat.mtimeMs) return 'up to date';

  return '';
}

async function optimizeImage(sourcePath) {
  scanned += 1;

  const sourceStat = await fs.stat(sourcePath);
  const parsed = path.parse(sourcePath);
  const outputPath = path.join(parsed.dir, `${parsed.name}.webp`);
  const skipReason = await shouldSkip(sourcePath, outputPath, sourceStat);

  if (skipReason) {
    skipped += 1;
    return { sourcePath, skipped: true, reason: skipReason };
  }

  const image = sharp(sourcePath, { limitInputPixels: false }).rotate();
  const metadata = await image.metadata();
  const resizeOptions = metadata.width && metadata.width > MAX_WIDTH
    ? { width: MAX_WIDTH, withoutEnlargement: true }
    : null;

  let pipeline = image;
  if (resizeOptions) pipeline = pipeline.resize(resizeOptions);

  await pipeline
    .webp({ quality: QUALITY, effort: 5 })
    .toFile(outputPath);

  const outputStat = await fs.stat(outputPath);
  converted += 1;
  inputBytes += sourceStat.size;
  outputBytes += outputStat.size;

  return {
    sourcePath,
    outputPath,
    input: sourceStat.size,
    output: outputStat.size,
    resized: Boolean(resizeOptions),
  };
}

const files = await listImageFiles(imagesDir);
const results = [];

for (const file of files) {
  results.push(await optimizeImage(file));
}

for (const result of results) {
  const relativeSource = path.relative(rootDir, result.sourcePath);
  if (result.skipped) {
    console.log(`skip ${relativeSource} (${result.reason})`);
    continue;
  }

  const relativeOutput = path.relative(rootDir, result.outputPath);
  const savings = Math.max(0, 1 - result.output / result.input);
  const resizeNote = result.resized ? ', resized' : '';
  console.log(
    `webp ${relativeSource} -> ${relativeOutput} ` +
    `(${formatBytes(result.input)} -> ${formatBytes(result.output)}, ` +
    `${Math.round(savings * 100)}% smaller${resizeNote})`,
  );
}

console.log('');
console.log(`Scanned: ${scanned}`);
console.log(`Converted: ${converted}`);
console.log(`Skipped: ${skipped}`);
if (converted > 0) {
  const savings = Math.max(0, 1 - outputBytes / inputBytes);
  console.log(`Total: ${formatBytes(inputBytes)} -> ${formatBytes(outputBytes)} (${Math.round(savings * 100)}% smaller)`);
}
