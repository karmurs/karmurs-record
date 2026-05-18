import { describe, expect, it } from 'vitest';
import { primarySections, publicRecordTypes, records } from '../data/records';

describe('records seed data', () => {
  it('contains homepage primary sections', () => {
    expect(primarySections.map((section) => section.id)).toEqual([
      'journal',
      'gallery',
      'racing',
      'devlog'
    ]);
  });

  it('keeps archive public record filters aligned with primary sections', () => {
    expect(publicRecordTypes).toEqual(primarySections.map((section) => section.id));
  });

  it('contains at least one visible record for each primary section', () => {
    for (const section of primarySections) {
      expect(records.some((record) => record.type === section.id && record.visibility === 'link')).toBe(true);
    }
  });

  it('uses public-safe seed records for the four primary sections', () => {
    expect(records.map((record) => record.title)).toEqual([
      '기록을 남기는 방식',
      '남겨둔 장면들',
      '랩타임 노트',
      '업데이트 기록'
    ]);
  });
});
