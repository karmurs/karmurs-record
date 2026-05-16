import { describe, expect, it } from 'vitest';
import { primarySections, records } from '../data/records';

describe('records seed data', () => {
  it('contains homepage primary sections', () => {
    expect(primarySections.map((section) => section.id)).toEqual([
      'journal',
      'gallery',
      'racing',
      'devlog'
    ]);
  });

  it('contains at least one visible record for each primary section', () => {
    for (const section of primarySections) {
      expect(records.some((record) => record.type === section.id && record.visibility === 'link')).toBe(true);
    }
  });
});
