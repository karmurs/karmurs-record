import { useEffect, useState } from 'react';
import type { RecordEntry } from '../data/records';
import {
  deleteAdminRecord,
  fetchAdminRecords,
  recordEntryToAdminFormState
} from '../lib/adminRecords';
import AdminRecordForm from './AdminRecordForm';

type AdminRecordListProps = {
  userId: string;
};

function getRemoteRecordId(record: RecordEntry) {
  return record.id.startsWith('remote:') ? record.id.replace('remote:', '') : null;
}

export default function AdminRecordList({ userId }: AdminRecordListProps) {
  const [records, setRecords] = useState<RecordEntry[]>([]);
  const [editingRecord, setEditingRecord] = useState<RecordEntry | null>(null);
  const [status, setStatus] = useState('Loading records...');

  const refreshRecords = async () => {
    const result = await fetchAdminRecords();

    setRecords(result.records);
    setStatus(result.error ?? '');
  };

  useEffect(() => {
    void refreshRecords();
  }, []);

  const handleDelete = async (record: RecordEntry) => {
    const recordId = getRemoteRecordId(record);

    if (!recordId) {
      return;
    }

    const shouldDelete = window.confirm(`"${record.title}" 글을 삭제할까요?`);

    if (!shouldDelete) {
      return;
    }

    setStatus('');
    const result = await deleteAdminRecord(recordId);

    if (result.error) {
      setStatus(result.error);
      return;
    }

    if (editingRecord?.id === record.id) {
      setEditingRecord(null);
    }
    await refreshRecords();
    setStatus('Record deleted.');
  };

  return (
    <section className="admin-card admin-record-list" aria-label="Admin saved records">
      <div className="admin-card-heading">
        <span className="admin-card-kicker">saved records</span>
        <strong>내 글 관리</strong>
      </div>

      {status ? <p className="admin-status">{status}</p> : null}

      {editingRecord ? (
        <AdminRecordForm
          initialRecord={editingRecord}
          onCancel={() => setEditingRecord(null)}
          onSaved={async () => {
            setEditingRecord(null);
            await refreshRecords();
          }}
          userId={userId}
        />
      ) : null}

      {records.length > 0 ? (
        <div className="admin-record-list-grid">
          {records.map((record) => {
            const formState = recordEntryToAdminFormState(record);

            return (
              <article className="admin-record-row" key={record.id}>
                <div>
                  <span>{formState.visibility}</span>
                  <strong>{record.title}</strong>
                  <p>{record.type} · {record.date}</p>
                </div>
                <div className="setup-card-admin-actions">
                  <button
                    className="setup-card-expand"
                    onClick={() => {
                      setEditingRecord(record);
                      setStatus('');
                    }}
                    type="button"
                  >
                    수정
                  </button>
                  <button
                    className="setup-card-expand setup-card-delete"
                    onClick={() => void handleDelete(record)}
                    type="button"
                  >
                    삭제
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="imported-empty-state">아직 저장된 관리자 글이 없습니다.</p>
      )}
    </section>
  );
}
