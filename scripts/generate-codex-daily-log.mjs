import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildCodexDailyLogDraft, renderCodexDailyLogMarkdown } from './lib/codex-daily-log.mjs';

function runGit(args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

function getDateArg() {
  const dateArg = process.argv.find((arg) => arg.startsWith('--date='));

  if (dateArg) {
    return dateArg.replace('--date=', '');
  }

  return new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'Asia/Seoul',
    year: 'numeric'
  }).format(new Date());
}

function getOutputDir() {
  const outputArg = process.argv.find((arg) => arg.startsWith('--out='));
  return outputArg ? outputArg.replace('--out=', '') : 'content/devlog';
}

const date = getDateArg();
const since = `${date} 00:00`;
const until = `${date} 23:59`;
const commitOutput = runGit(['log', `--since=${since}`, `--until=${until}`, '--pretty=format:%h %s']);
const statusOutput = runGit(['status', '--short']);
const sourceCommit = runGit(['rev-parse', '--short', 'HEAD']);
const commits = commitOutput ? commitOutput.split(/\r?\n/) : [];
const changedFiles = statusOutput
  ? statusOutput
      .split(/\r?\n/)
      .map((line) => line.replace(/^..?\s+/, '').trim())
      .filter(Boolean)
  : [];

const draft = buildCodexDailyLogDraft({
  changedFiles,
  commits,
  date,
  sourceCommit,
  verification: ['verification pending']
});
const outputDir = getOutputDir();
const outputPath = join(outputDir, `${date}.md`);

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputPath, renderCodexDailyLogMarkdown(draft), 'utf8');

console.log(`Codex daily log draft written: ${outputPath}`);
