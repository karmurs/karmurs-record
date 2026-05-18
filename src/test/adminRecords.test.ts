import { describe, expect, it } from 'vitest';
import {
  buildAdminRecordInsert,
  buildAdminRecordUpdate,
  mapAdminRecordAssetRow,
  mapAdminRecordRow,
  recordEntryToAdminFormState
} from '../lib/adminRecords';

describe('admin records', () => {
  it('builds a safe draft record insert payload', () => {
    expect(
      buildAdminRecordInsert(
        {
          title: '오늘의 기록',
          type: 'journal',
          visibility: 'draft',
          summary: '짧은 요약',
          body: '본문 내용',
          tags: 'daily, homepage, daily'
        },
        'user-123'
      )
    ).toEqual({
      slug: 'oneulyi-girog',
      title: '오늘의 기록',
      type: 'journal',
      visibility: 'draft',
      summary: '짧은 요약',
      body: '본문 내용',
      tags: ['daily', 'homepage'],
      published_at: null,
      created_by: 'user-123'
    });
  });

  it('sets published_at when a record is public', () => {
    const payload = buildAdminRecordInsert(
      {
        title: 'Racing update',
        type: 'devlog',
        visibility: 'public',
        summary: '',
        body: '',
        tags: ''
      },
      'user-123'
    );

    expect(payload.slug).toBe('racing-update');
    expect(payload.published_at).toEqual(expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/));
  });

  it('builds an update payload without creation-only fields', () => {
    expect(
      buildAdminRecordUpdate({
        title: '수정한 글',
        type: 'gallery',
        visibility: 'public',
        summary: '새 요약',
        body: '새 본문',
        tags: 'photo, update'
      })
    ).toEqual({
      slug: '수정한-글',
      title: '수정한 글',
      type: 'gallery',
      visibility: 'public',
      summary: '새 요약',
      body: '새 본문',
      tags: ['photo', 'update'],
      published_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/)
    });
  });

  it('converts a public record entry into editable form state', () => {
    expect(
      recordEntryToAdminFormState({
        id: 'remote:record-id',
        title: '게시된 글',
        type: 'devlog',
        date: '2026-05-18',
        summary: '공개 요약',
        body: '공개 본문',
        tags: ['devlog', 'homepage'],
        visibility: 'link',
        createdAt: '2026-05-18T12:00:00+09:00',
        updatedAt: '2026-05-18T12:00:00+09:00'
      })
    ).toEqual({
      title: '게시된 글',
      type: 'devlog',
      visibility: 'public',
      summary: '공개 요약',
      body: '공개 본문',
      tags: 'devlog, homepage'
    });
  });

  it('maps draft and private admin rows into editable record entries', () => {
    expect(
      mapAdminRecordRow({
        id: 'draft-id',
        title: '초안 글',
        type: 'journal',
        visibility: 'draft',
        summary: '초안 요약',
        body: '초안 본문',
        tags: ['draft'],
        published_at: null,
        created_at: '2026-05-18T11:00:00+09:00',
        updated_at: '2026-05-18T11:30:00+09:00'
      })
    ).toMatchObject({
      id: 'remote:draft-id',
      title: '초안 글',
      type: 'journal',
      date: '2026-05-18',
      visibility: 'private',
      adminVisibility: 'draft'
    });
  });

  it('preserves draft visibility when reopening an admin record form', () => {
    expect(
      recordEntryToAdminFormState({
        id: 'remote:draft-id',
        title: '초안 글',
        type: 'devlog',
        date: '2026-05-18',
        summary: '초안 요약',
        body: '초안 본문',
        tags: ['devlog'],
        visibility: 'private',
        adminVisibility: 'draft',
        createdAt: '2026-05-18T11:00:00+09:00',
        updatedAt: '2026-05-18T11:30:00+09:00'
      })
    ).toMatchObject({
      title: '초안 글',
      type: 'devlog',
      visibility: 'draft'
    });
  });

  it('maps record asset rows for the editor image list', () => {
    expect(
      mapAdminRecordAssetRow(
        {
          id: 'asset-id',
          record_id: 'record-id',
          storage_bucket: 'record-assets',
          storage_path: 'records/record-id/image.png',
          alt_text: '대표 이미지',
          caption: '캡션',
          is_public: true,
          is_cover: true,
          created_at: '2026-05-18T12:00:00+09:00'
        },
        'https://example.supabase.co/storage/v1/object/public/record-assets/records/record-id/image.png'
      )
    ).toEqual({
      id: 'asset-id',
      recordId: 'record-id',
      storageBucket: 'record-assets',
      storagePath: 'records/record-id/image.png',
      altText: '대표 이미지',
      caption: '캡션',
      isPublic: true,
      isCover: true,
      createdAt: '2026-05-18T12:00:00+09:00',
      publicUrl: 'https://example.supabase.co/storage/v1/object/public/record-assets/records/record-id/image.png'
    });
  });
});
