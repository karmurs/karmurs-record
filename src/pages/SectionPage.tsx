import type { View } from '../App';
import RecordCard from '../components/RecordCard';
import SiteShell from '../components/SiteShell';
import {
  getPublicRecords,
  getRecordsByType,
  primarySections,
  type RecordType
} from '../data/records';

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
  const sectionInfo = sectionCopy[section];
  const records = section === 'archive' ? getPublicRecords() : getRecordsByType(section);
  const primarySection = primarySections.find((item) => item.id === section);

  return (
    <SiteShell onNavigate={onNavigate}>
      <main className="page-panel">
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

        {records.length > 0 ? (
          <div className="record-grid">
            {records.map((record) => (
              <RecordCard key={record.id} onNavigate={onNavigate} record={record} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <strong>아직 공개된 기록이 없어요.</strong>
            <p>이 섹션은 곧 새로운 기록을 받을 빈 페이지로 남겨둘게요.</p>
          </div>
        )}
      </main>
    </SiteShell>
  );
}
