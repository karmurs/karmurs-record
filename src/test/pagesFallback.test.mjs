import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const scriptPath = resolve('scripts/create-pages-spa-fallback.mjs');

describe('GitHub Pages SPA fallback', () => {
  it('has a fallback generator script for GitHub Pages deep links', () => {
    expect(existsSync(scriptPath)).toBe(true);
  });

  it('copies index.html to 404.html for static SPA fallback', () => {
    expect(existsSync(scriptPath)).toBe(true);

    const outDir = mkdtempSync(join(tmpdir(), 'karmurs-pages-fallback-'));

    try {
      writeFileSync(join(outDir, 'index.html'), '<div id="root">Karmurs</div>', 'utf8');

      execFileSync(process.execPath, [scriptPath, outDir], {
        cwd: process.cwd(),
        stdio: 'pipe',
      });

      expect(readFileSync(join(outDir, '404.html'), 'utf8')).toBe(
        '<div id="root">Karmurs</div>',
      );
    } finally {
      rmSync(outDir, { recursive: true, force: true });
    }
  });
});
