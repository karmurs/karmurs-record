import { useState } from 'react';
import type { View } from '../App';
import RecordCard from '../components/RecordCard';
import RacingExplorer from '../components/RacingExplorer';
import SiteShell from '../components/SiteShell';
import {
  getPublicRecords,
  getRecordsByType,
  primarySections,
  publicRecordTypes,
  type RecordType
} from '../data/records';

type ArchiveFilter = 'all' | (typeof publicRecordTypes)[number];

const sectionCopy: Record<RecordType, { title: string; description: string }> = {
  journal: {
    title: 'Journal',
    description: '생각, 일기, 짧은 문장을 날짜별로 모아두는 공간.'
  },
  gallery: {
    title: 'Gallery',
    description: '사진, 캡처, 분위기 이미지를 천천히 꺼내 보는 공간.'
  },
  racing: {
    title: 'Racing',
    description: '랩타임, 세션, 트랙 메모를 기록하는 공간.'
  },
  devlog: {
    title: 'Devlog',
    description: '홈페이지 제작 과정, 수정 기록, 다음 아이디어를 남기는 개발일지.'
  },
  archive: {
    title: 'Archive',
    description: '글, 사진, 파일, 링크를 오래 보관하는 기록함.'
  },
  project: {
    title: 'Project',
    description: '진행 중인 작업과 아이디어를 정리하는 공간.'
  },
  note: {
    title: 'Note',
    description: '작은 메모와 우연히 다시 보고 싶은 조각들.'
  }
};

type SectionPageProps = {
  onNavigate: (view: View) => void;
  section: RecordType;
};

export default function SectionPage({ onNavigate, section }: SectionPageProps) {
  const [archiveFilter, setArchiveFilter] = useState<ArchiveFilter>('all');
  const [archiveQuery, setArchiveQuery] = useState('');
  const sectionInfo = sectionCopy[section];
  const archiveRecords = getPublicRecords();
  const normalizedQuery = archiveQuery.trim().toLocaleLowerCase();
  const records =
    section === 'archive'
      ? archiveRecords.filter((record) => {
          const matchesFilter = archiveFilter === 'all' || record.type === archiveFilter;
          const searchableText = [
            record.title,
            record.summary,
            record.body,
            record.type,
            ...record.tags
          ]
            .join(' ')
            .toLocaleLowerCase();

          return matchesFilter && (!normalizedQuery || searchableText.includes(normalizedQuery));
        })
      : getRecordsByType(section);
  const primarySection = primarySections.find((item) => item.id === section);
  const archiveFilterOptions = [
    { id: 'all' as const, label: 'All', count: archiveRecords.length },
    ...publicRecordTypes.map((type) => ({
      id: type,
      label: sectionCopy[type].title,
      count: archiveRecords.filter((record) => record.type === type).length
    }))
  ];

  return (
    <SiteShell onNavigate={onNavigate}>
      <main className={`page-panel ${section === 'racing' ? 'page-panel-racing' : ''}`}>
        <div className="page-actions">
          <button
            className="text-button"
            onClick={() => onNavigate({ name: 'home' })}
            type="button"
          >
            Home
          </button>
        </div>

        <section className="section-intro" aria-labelledby="section-title">
          <p className="hero-kicker">{primarySection?.eyebrow ?? 'private archive'}</p>
          <h1 id="section-title">{sectionInfo.title}</h1>
          <p>{sectionInfo.description}</p>
        </section>

        {section === 'archive' ? (
          <div className="archive-tools">
            <label className="archive-search">
              <span>Search archive</span>
              <input
                onChange={(event) => setArchiveQuery(event.target.value)}
                placeholder="title, tag, note..."
                type="search"
                value={archiveQuery}
              />
            </label>
            <div className="archive-filter" aria-label="Archive filters" role="group">
              {archiveFilterOptions.map((option) => (
                <button
                  aria-pressed={archiveFilter === option.id}
                  className="filter-chip"
                  key={option.id}
                  onClick={() => setArchiveFilter(option.id)}
                  type="button"
                >
                  <span>{option.label}</span>
                  <small>{option.count}</small>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {section === 'racing' ? (
          <RacingExplorer />
        ) : records.length > 0 ? (
          <div className="record-grid">
            {records.map((record) => (
              <RecordCard key={record.id} onNavigate={onNavigate} record={record} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <strong>{section === 'archive' ? '맞는 기록을 찾지 못했어요.' : '아직 공개된 기록이 없어요.'}</strong>
            <p>
              {section === 'archive'
                ? '검색어를 줄이거나 다른 필터로 다시 훑어보세요.'
                : '이 섹션은 곧 새로운 기록을 받을 빈 페이지로 남겨둘게요.'}
            </p>
          </div>
        )}
      </main>
    </SiteShell>
  );
}
