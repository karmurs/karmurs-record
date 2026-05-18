import type { View } from '../App';
import type { RecordEntry } from '../data/records';

type RecordCardProps = {
  canManage?: boolean;
  onDelete?: (record: RecordEntry) => void;
  onEdit?: (record: RecordEntry) => void;
  onNavigate: (view: View) => void;
  record: RecordEntry;
};

export default function RecordCard({ canManage = false, onDelete, onEdit, onNavigate, record }: RecordCardProps) {
  const canManageRecord = canManage && record.id.startsWith('remote:');

  return (
    <article className="record-card-shell">
      <button
        className={`record-card record-card-${record.imageTone ?? 'warm'}`}
        onClick={() => onNavigate({ name: 'detail', recordId: record.id })}
        type="button"
      >
        {record.coverImageUrl ? (
          <span className="record-card-image">
            <img alt={record.coverImageAlt ?? record.title} src={record.coverImageUrl} />
          </span>
        ) : null}
        <time dateTime={record.date}>{record.date}</time>
        <strong>{record.title}</strong>
        <span className="record-card-summary">{record.summary}</span>
      </button>
      {canManageRecord ? (
        <div className="record-card-admin-actions">
          <button className="setup-card-expand" onClick={() => onEdit?.(record)} type="button">
            수정
          </button>
          <button className="setup-card-expand setup-card-delete" onClick={() => onDelete?.(record)} type="button">
            삭제
          </button>
        </div>
      ) : null}
    </article>
  );
}
