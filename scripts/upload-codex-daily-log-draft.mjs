import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import {
  buildDevlogRecordPayload,
  normalizeSupabaseProjectUrl,
  parseCodexDailyLogMarkdown
} from './lib/codex-daily-log.mjs';

function parseDotEnv(filePath) {
  if (!existsSync(filePath)) {
    return {};
  }

  return Object.fromEntries(
    readFileSync(filePath, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const separatorIndex = line.indexOf('=');
        const key = separatorIndex === -1 ? line : line.slice(0, separatorIndex);
        const value = separatorIndex === -1 ? '' : line.slice(separatorIndex + 1);
        return [key.trim(), value.trim().replace(/^"|"$/g, '')];
      })
  );
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

function getDraftPath(date) {
  const fileArg = process.argv.find((arg) => arg.startsWith('--file='));
  return fileArg ? fileArg.replace('--file=', '') : join('content', 'devlog', `${date}.md`);
}

const localEnv = {
  ...parseDotEnv('.env.local'),
  ...process.env
};
const date = getDateArg();
const draftPath = getDraftPath(date);

if (!existsSync(draftPath)) {
  throw new Error(`Devlog draft not found: ${draftPath}`);
}

const requiredEnv = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'CODEX_DEVLOG_ADMIN_EMAIL',
  'CODEX_DEVLOG_ADMIN_PASSWORD'
];
const missingEnv = requiredEnv.filter((key) => !localEnv[key]);

if (missingEnv.length > 0) {
  throw new Error(`Missing local env values: ${missingEnv.join(', ')}`);
}

const supabaseUrl = normalizeSupabaseProjectUrl(localEnv.VITE_SUPABASE_URL);
const supabase = createClient(supabaseUrl, localEnv.VITE_SUPABASE_ANON_KEY);
const signInResult = await supabase.auth.signInWithPassword({
  email: localEnv.CODEX_DEVLOG_ADMIN_EMAIL,
  password: localEnv.CODEX_DEVLOG_ADMIN_PASSWORD
});

if (signInResult.error) {
  throw new Error(`Admin sign-in failed: ${signInResult.error.message}`);
}

const draft = parseCodexDailyLogMarkdown(readFileSync(draftPath, 'utf8'));
const payload = {
  ...buildDevlogRecordPayload(draft),
  created_by: signInResult.data.user?.id
};
const { error } = await supabase.from('records').upsert(payload, { onConflict: 'slug' });

if (error) {
  throw new Error(`Devlog draft upload failed: ${error.message}`);
}

console.log(`Codex daily log draft uploaded as records draft: ${payload.slug}`);
