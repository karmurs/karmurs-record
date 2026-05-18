import { describe, expect, it } from 'vitest';
import {
  buildCodexDailyLogDraft,
  buildDevlogRecordPayload,
  normalizeSupabaseProjectUrl,
  parseCodexDailyLogMarkdown,
  renderCodexDailyLogMarkdown,
  sanitizePublicDevlogLines
} from '../../scripts/lib/codex-daily-log.mjs';

describe('codex daily log draft generator', () => {
  it('removes sensitive lines from public devlog material', () => {
    expect(
      sanitizePublicDevlogLines([
        'Added racing setup editor',
        'Touched .env.local',
        'SUPABASE_SERVICE_ROLE_KEY was configured',
        'Ran npm test'
      ])
    ).toEqual(['Added racing setup editor', 'Ran npm test']);
  });

  it('builds a draft daily log from commits, files, and verification', () => {
    const draft = buildCodexDailyLogDraft({
      changedFiles: ['src/components/AdminRecordForm.tsx', '.env.local'],
      commits: ['abc123 Add admin record editing'],
      date: '2026-05-18',
      sourceCommit: 'abc123',
      verification: ['npm test: passed', 'npm run build: passed']
    });

    expect(draft).toMatchObject({
      draft: true,
      title: '2026-05-18 작업 기록',
      sourceCommit: 'abc123',
      tags: ['devlog', 'codex', 'daily']
    });
    expect(draft.body).toContain('Add admin record editing');
    expect(draft.body).toContain('AdminRecordForm.tsx');
    expect(draft.body).not.toContain('.env.local');
  });

  it('renders a markdown draft with frontmatter', () => {
    const markdown = renderCodexDailyLogMarkdown({
      body: '오늘은 관리자 기능을 다듬었다.',
      date: '2026-05-18',
      draft: true,
      sourceCommit: 'abc123',
      summary: '관리자 기능 정리',
      tags: ['devlog', 'codex', 'daily'],
      title: '2026-05-18 작업 기록'
    });

    expect(markdown).toContain('draft: true');
    expect(markdown).toContain('sourceCommit: abc123');
    expect(markdown).toContain('오늘은 관리자 기능을 다듬었다.');
  });

  it('parses a markdown draft and builds a Supabase records payload', () => {
    const parsed = parseCodexDailyLogMarkdown(`---
title: "2026-05-18 작업 기록"
date: 2026-05-18
draft: true
summary: "관리자 기능 정리"
tags: ["devlog", "codex", "daily"]
sourceCommit: abc123
---

오늘은 관리자 기능을 다듬었다.
`);

    expect(parsed).toMatchObject({
      date: '2026-05-18',
      draft: true,
      sourceCommit: 'abc123',
      title: '2026-05-18 작업 기록'
    });
    expect(buildDevlogRecordPayload(parsed)).toEqual({
      body: '오늘은 관리자 기능을 다듬었다.',
      published_at: null,
      slug: 'codex-daily-2026-05-18',
      summary: '관리자 기능 정리',
      tags: ['devlog', 'codex', 'daily'],
      title: '2026-05-18 작업 기록',
      type: 'devlog',
      visibility: 'draft'
    });
  });

  it('normalizes a Supabase project base URL for devlog uploads', () => {
    expect(normalizeSupabaseProjectUrl('https://project-ref.supabase.co/')).toBe(
      'https://project-ref.supabase.co'
    );
  });

  it('rejects Supabase API or dashboard URLs for devlog uploads', () => {
    expect(() => normalizeSupabaseProjectUrl('https://project-ref.supabase.co/auth/v1')).toThrow(
      /project base URL/
    );
    expect(() =>
      normalizeSupabaseProjectUrl('https://supabase.com/dashboard/project/project-ref')
    ).toThrow(/project base URL/);
  });
});
