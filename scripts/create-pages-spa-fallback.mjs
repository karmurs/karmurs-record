import { copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.argv[2] ?? 'dist';
const indexPath = join(outDir, 'index.html');
const fallbackPath = join(outDir, '404.html');

if (!existsSync(indexPath)) {
  throw new Error(`Cannot create GitHub Pages SPA fallback: ${indexPath} does not exist.`);
}

copyFileSync(indexPath, fallbackPath);
console.log(`GitHub Pages SPA fallback written: ${fallbackPath}`);
