import type { View } from '../App';
import type { RecordEntry } from '../data/records';

type RecordCardProps = {
  onNavigate: (view: View) => void;
  record: RecordEntry;
};

export default function RecordCard({ onNavigate, record }: RecordCardProps) {
  return (
    <button
      className={`record-card record-card-${record.imageTone ?? 'warm'}`}
      onClick={() => onNavigate({ name: 'detail', recordId: record.id })}
      type="button"
    >
      <time dateTime={record.date}>{record.date}</time>
      <strong>{record.title}</strong>
      <span className="record-card-summary">{record.summary}</span>
    </button>
  );
}
