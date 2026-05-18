import { describe, expect, it } from 'vitest';
import { mapRemoteRecord, mergePublicRecords } from '../data/remoteRecords';
import { records } from '../data/records';

describe('remote records', () => {
  it('maps published Supabase records into homepage records', () => {
    expect(
      mapRemoteRecord({
        id: 'remote-id',
        title: 'Supabase 글',
        type: 'journal',
        summary: '요약',
        body: '본문',
        tags: ['supabase', 'journal'],
        published_at: '2026-05-18T14:00:00+09:00',
        created_at: '2026-05-18T13:59:00+09:00',
        updated_at: '2026-05-18T14:00:00+09:00'
      })
    ).toEqual({
      id: 'remote:remote-id',
      title: 'Supabase 글',
      type: 'journal',
      date: '2026-05-18',
      summary: '요약',
      body: '본문',
      tags: ['supabase', 'journal'],
      visibility: 'link',
      createdAt: '2026-05-18T13:59:00+09:00',
      updatedAt: '2026-05-18T14:00:00+09:00',
      imageTone: 'warm'
    });
  });

  it('merges remote public records before seed records by date', () => {
    const merged = mergePublicRecords(records, [
      {
        id: 'remote:1',
        title: 'Newest',
        type: 'devlog',
        date: '2026-05-18',
        summary: '',
        body: '',
        tags: [],
        visibility: 'link',
        createdAt: '2026-05-18T14:00:00+09:00',
        updatedAt: '2026-05-18T14:00:00+09:00'
      }
    ]);

    expect(merged[0].title).toBe('Newest');
  });
});
