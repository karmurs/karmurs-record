import type { View } from '../App';
import SiteShell from '../components/SiteShell';
import { getRecordById } from '../data/records';

type RecordDetailPageProps = {
  onNavigate: (view: View) => void;
  recordId: string;
};

export default function RecordDetailPage({ onNavigate, recordId }: RecordDetailPageProps) {
  const record = getRecordById(recordId);

  if (!record) {
    return (
      <SiteShell onNavigate={onNavigate}>
        <main className="page-panel">
          <div className="detail-panel">
            <p className="hero-kicker">missing record</p>
            <h1>기록을 찾을 수 없어요</h1>
            <p>공개되지 않았거나 아직 저장되지 않은 기록이에요.</p>
            <button
              className="text-button"
              onClick={() => onNavigate({ name: 'home' })}
              type="button"
            >
              Home
            </button>
          </div>
        </main>
      </SiteShell>
    );
  }

  return (
    <SiteShell onNavigate={onNavigate}>
      <main className="page-panel">
        <div className="page-actions">
          <button
            className="text-button"
            onClick={() => onNavigate({ name: 'section', section: record.type })}
            type="button"
          >
            Back
          </button>
          <button
            className="text-button"
            onClick={() => onNavigate({ name: 'home' })}
            type="button"
          >
            Home
          </button>
        </div>

        <article className="detail-panel">
          <p className="hero-kicker">{record.type}</p>
          <time dateTime={record.date}>{record.date}</time>
          <h1>{record.title}</h1>
          <p className="detail-summary">{record.summary}</p>
          <p>{record.body}</p>
          <div className="tag-row" aria-label="Record tags">
            {record.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </article>
      </main>
    </SiteShell>
  );
}
