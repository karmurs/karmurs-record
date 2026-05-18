const sensitivePatterns = [
  /\.env/i,
  /anon[_-]?key/i,
  /api[_-]?key/i,
  /auth/i,
  /database password/i,
  /jwt/i,
  /password/i,
  /secret/i,
  /service[_-]?role/i,
  /supabase_.*key/i,
  /token/i
];

export function sanitizePublicDevlogLines(lines) {
  return lines
    .map((line) => String(line ?? '').trim())
    .filter(Boolean)
    .filter((line) => !sensitivePatterns.some((pattern) => pattern.test(line)));
}

function uniqueBasenames(paths) {
  const safePaths = sanitizePublicDevlogLines(paths);

  return [...new Set(safePaths.map((path) => path.split(/[\\/]/).pop()).filter(Boolean))];
}

export function buildCodexDailyLogDraft({
  changedFiles = [],
  commits = [],
  date,
  sourceCommit = '',
  verification = []
}) {
  const safeCommits = sanitizePublicDevlogLines(commits);
  const safeVerification = sanitizePublicDevlogLines(verification);
  const fileNames = uniqueBasenames(changedFiles);
  const title = `${date} 작업 기록`;
  const summaryParts = [];

  if (safeCommits.length > 0) {
    summaryParts.push(safeCommits[0].replace(/^[a-f0-9]{6,}\s+/i, ''));
  }

  if (fileNames.length > 0) {
    summaryParts.push(`${fileNames.slice(0, 3).join(', ')} 정리`);
  }

  const summary = summaryParts.join(' · ') || '홈페이지 작업 내용을 공개 가능한 범위에서 정리했다.';
  const bodySections = [
    '오늘은 홈페이지 작업 내용을 공개 가능한 범위로 정리했다.',
    safeCommits.length > 0
      ? `작업 흐름은 ${safeCommits.map((commit) => commit.replace(/^[a-f0-9]{6,}\s+/i, '')).join(', ')} 쪽에 가까웠다.`
      : '커밋으로 정리되지 않은 변경도 있었지만, 공개해도 되는 수준의 기능 단위만 남겼다.',
    fileNames.length > 0
      ? `주로 손본 파일은 ${fileNames.slice(0, 8).join(', ')}이다.`
      : '파일 변경 목록은 아직 비어 있거나 공개 기록에 남길 만한 내용이 없었다.',
    safeVerification.length > 0
      ? `확인은 ${safeVerification.join(', ')} 기준으로 남긴다.`
      : '검증 결과는 별도 실행 후 채워 넣을 예정이다.'
  ];

  return {
    body: bodySections.join('\n\n'),
    date,
    draft: true,
    sourceCommit,
    summary,
    tags: ['devlog', 'codex', 'daily'],
    title
  };
}

export function renderCodexDailyLogMarkdown(draft) {
  const tags = draft.tags.map((tag) => `"${tag}"`).join(', ');

  return `---\ntitle: "${draft.title}"\ndate: ${draft.date}\ndraft: ${draft.draft ? 'true' : 'false'}\nsummary: "${draft.summary.replace(/"/g, '\\"')}"\ntags: [${tags}]\nsourceCommit: ${draft.sourceCommit || ''}\n---\n\n${draft.body}\n`;
}

function parseFrontmatterValue(value) {
  const trimmed = value.trim();

  if (trimmed === 'true') {
    return true;
  }

  if (trimmed === 'false') {
    return false;
  }

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim().replace(/^"|"$/g, ''))
      .filter(Boolean);
  }

  return trimmed.replace(/^"|"$/g, '');
}

export function parseCodexDailyLogMarkdown(markdown) {
  const match = String(markdown).match(/^---\n([\s\S]*?)\n---\n\n?([\s\S]*)$/);

  if (!match) {
    throw new Error('Codex daily log markdown must include frontmatter.');
  }

  const frontmatter = {};

  for (const line of match[1].split(/\r?\n/)) {
    const separatorIndex = line.indexOf(':');

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1);
    frontmatter[key] = parseFrontmatterValue(value);
  }

  return {
    body: match[2].trim(),
    date: frontmatter.date,
    draft: frontmatter.draft !== false,
    sourceCommit: frontmatter.sourceCommit ?? '',
    summary: frontmatter.summary ?? '',
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    title: frontmatter.title
  };
}

export function buildDevlogRecordPayload(draft) {
  return {
    body: draft.body,
    published_at: null,
    slug: `codex-daily-${draft.date}`,
    summary: draft.summary,
    tags: draft.tags,
    title: draft.title,
    type: 'devlog',
    visibility: 'draft'
  };
}

export function normalizeSupabaseProjectUrl(rawUrl) {
  let parsedUrl;

  try {
    parsedUrl = new URL(String(rawUrl ?? '').trim());
  } catch {
    throw new Error(
      'VITE_SUPABASE_URL must be the project base URL, for example https://PROJECT_REF.supabase.co.'
    );
  }

  const hasPath = parsedUrl.pathname !== '/';
  const isSupabaseProjectHost = /^[a-z0-9-]+\.supabase\.co$/i.test(parsedUrl.hostname);

  if (hasPath || !isSupabaseProjectHost) {
    throw new Error(
      'VITE_SUPABASE_URL must be the project base URL, for example https://PROJECT_REF.supabase.co. Remove dashboard, /auth/v1, /rest/v1, or other path parts.'
    );
  }

  parsedUrl.pathname = '';
  parsedUrl.search = '';
  parsedUrl.hash = '';

  return parsedUrl.toString().replace(/\/$/, '');
}
