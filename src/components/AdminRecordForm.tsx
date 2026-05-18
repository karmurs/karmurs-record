import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import {
  deleteAdminRecordAsset,
  fetchAdminRecordAssets,
  recordEntryToAdminFormState,
  saveAdminRecord,
  setAdminRecordCoverAsset,
  updateAdminRecord,
  type AdminRecordAsset,
  type AdminRecordFormState,
  type AdminRecordType,
  type AdminRecordVisibility
} from '../lib/adminRecords';
import type { RecordEntry } from '../data/records';

type AdminRecordFormProps = {
  initialRecord?: RecordEntry;
  initialType?: AdminRecordType;
  onCancel?: () => void;
  onSaved?: () => void | Promise<void>;
  userId: string;
};

const sectionOptions: Array<{ label: string; value: AdminRecordType }> = [
  { label: 'Journal', value: 'journal' },
  { label: 'Gallery', value: 'gallery' },
  { label: 'Racing', value: 'racing' },
  { label: 'Devlog', value: 'devlog' }
];

const visibilityOptions: Array<{ label: string; value: AdminRecordVisibility }> = [
  { label: 'Draft', value: 'draft' },
  { label: 'Private', value: 'private' },
  { label: 'Public', value: 'public' }
];

function createRecordFormState(initialType: AdminRecordType = 'journal'): AdminRecordFormState {
  return {
    title: '',
    type: initialType,
    visibility: 'draft',
    summary: '',
    body: '',
    tags: ''
  };
}

function getRemoteRecordId(record?: RecordEntry) {
  return record?.id.startsWith('remote:') ? record.id.replace('remote:', '') : null;
}

export default function AdminRecordForm({
  initialRecord,
  initialType = 'journal',
  onCancel,
  onSaved,
  userId
}: AdminRecordFormProps) {
  const remoteRecordId = getRemoteRecordId(initialRecord);
  const isEditing = Boolean(remoteRecordId);
  const [recordForm, setRecordForm] = useState<AdminRecordFormState>(() =>
    initialRecord ? recordEntryToAdminFormState(initialRecord) : createRecordFormState(initialType)
  );
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingAssets, setExistingAssets] = useState<AdminRecordAsset[]>([]);
  const [recordStatus, setRecordStatus] = useState('');
  const [isSavingRecord, setIsSavingRecord] = useState(false);
  const [deletingAssetId, setDeletingAssetId] = useState<string | null>(null);
  const [coveringAssetId, setCoveringAssetId] = useState<string | null>(null);

  useEffect(() => {
    setRecordForm(initialRecord ? recordEntryToAdminFormState(initialRecord) : createRecordFormState(initialType));
    setImageFiles([]);
    setRecordStatus('');
  }, [initialRecord, initialType]);

  useEffect(() => {
    let isMounted = true;

    if (!remoteRecordId) {
      setExistingAssets([]);
      return undefined;
    }

    fetchAdminRecordAssets(remoteRecordId).then((result) => {
      if (!isMounted) {
        return;
      }

      setExistingAssets(result.assets);
      if (result.error) {
        setRecordStatus(result.error);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [remoteRecordId]);

  const updateRecordForm = (field: keyof AdminRecordFormState, value: string) => {
    setRecordForm((current) => ({ ...current, [field]: value }));
  };

  const handleRecordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingRecord(true);
    setRecordStatus('');

    const result =
      isEditing && remoteRecordId
        ? await updateAdminRecord(remoteRecordId, recordForm, userId, imageFiles)
        : await saveAdminRecord(recordForm, userId, imageFiles);

    setIsSavingRecord(false);

    if (result.error) {
      setRecordStatus(result.error);
      return;
    }

    setRecordStatus(
      isEditing
        ? 'Record updated.'
        : recordForm.visibility === 'public'
        ? 'Public record saved. Refresh this section after Supabase grants are applied.'
        : 'Draft saved.'
    );
    await onSaved?.();
    if (!isEditing) {
      setRecordForm(createRecordFormState(initialType));
    }
    setImageFiles([]);
    if (remoteRecordId) {
      const assetsResult = await fetchAdminRecordAssets(remoteRecordId);
      setExistingAssets(assetsResult.assets);
      if (assetsResult.error) {
        setRecordStatus(assetsResult.error);
      }
    }
  };

  const handleDeleteAsset = async (asset: AdminRecordAsset) => {
    const shouldDelete = window.confirm('이 이미지를 삭제할까요?');

    if (!shouldDelete) {
      return;
    }

    setDeletingAssetId(asset.id);
    setRecordStatus('');
    const result = await deleteAdminRecordAsset(asset);
    setDeletingAssetId(null);

    if (result.error) {
      setRecordStatus(result.error);
      return;
    }

    setExistingAssets((current) => current.filter((item) => item.id !== asset.id));
    setRecordStatus('Image deleted.');
  };

  const handleSetCoverAsset = async (asset: AdminRecordAsset) => {
    setCoveringAssetId(asset.id);
    setRecordStatus('');
    const result = await setAdminRecordCoverAsset(asset);
    setCoveringAssetId(null);

    if (result.error) {
      setRecordStatus(result.error);
      return;
    }

    setExistingAssets((current) =>
      current.map((item) => ({ ...item, isCover: item.id === asset.id }))
    );
    setRecordStatus('Cover image updated.');
  };

  return (
    <form className="admin-card admin-editor-form" onSubmit={handleRecordSubmit}>
      <div className="admin-card-heading">
        <span className="admin-card-kicker">{isEditing ? 'edit record' : 'new record'}</span>
        <strong>{isEditing ? '글 수정' : '새 글 작성'}</strong>
      </div>
      <label>
        Title
        <input
          onChange={(event) => updateRecordForm('title', event.target.value)}
          required
          value={recordForm.title}
        />
      </label>
      <div className="admin-form-grid">
        <fieldset className="admin-choice-field">
          <legend>Section</legend>
          <div className="admin-choice-group" role="group" aria-label="Record section">
            {sectionOptions.map((option) => (
              <button
                aria-pressed={recordForm.type === option.value}
                className="admin-choice-button"
                key={option.value}
                onClick={() => updateRecordForm('type', option.value)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="admin-choice-field">
          <legend>Visibility</legend>
          <div className="admin-choice-group" role="group" aria-label="Record visibility">
            {visibilityOptions.map((option) => (
              <button
                aria-pressed={recordForm.visibility === option.value}
                className="admin-choice-button"
                key={option.value}
                onClick={() => updateRecordForm('visibility', option.value)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
      <label>
        Summary
        <textarea
          onChange={(event) => updateRecordForm('summary', event.target.value)}
          rows={3}
          value={recordForm.summary}
        />
      </label>
      <label>
        Body
        <textarea
          onChange={(event) => updateRecordForm('body', event.target.value)}
          required
          rows={8}
          value={recordForm.body}
        />
      </label>
      <label>
        Tags
        <input
          onChange={(event) => updateRecordForm('tags', event.target.value)}
          placeholder={`${recordForm.type}, homepage`}
          value={recordForm.tags}
        />
      </label>
      <label>
        Images
        <input
          accept="image/*"
          multiple
          onChange={(event) => setImageFiles(Array.from(event.target.files ?? []))}
          type="file"
        />
      </label>
      {imageFiles.length > 0 ? (
        <div className="admin-image-list" aria-label="Selected images">
          {imageFiles.map((file) => (
            <span key={`${file.name}-${file.lastModified}`}>{file.name}</span>
          ))}
        </div>
      ) : null}
      {isEditing ? (
        <section className="admin-existing-images" aria-label="Existing record images">
          <span className="admin-card-kicker">existing images</span>
          {existingAssets.length > 0 ? (
            <div className="admin-existing-image-grid">
              {existingAssets.map((asset) => (
                <figure className="admin-existing-image" key={asset.id}>
                  <img alt={asset.altText || recordForm.title} src={asset.publicUrl} />
                  <figcaption>
                    {asset.isCover ? <span>대표</span> : null}
                    {asset.caption || asset.storagePath.split('/').pop()}
                  </figcaption>
                  <button
                    className="setup-card-expand"
                    disabled={asset.isCover || coveringAssetId === asset.id}
                    onClick={() => void handleSetCoverAsset(asset)}
                    type="button"
                  >
                    {asset.isCover ? '대표 이미지' : coveringAssetId === asset.id ? '지정 중' : '대표로 지정'}
                  </button>
                  <button
                    className="setup-card-expand setup-card-delete"
                    disabled={deletingAssetId === asset.id}
                    onClick={() => void handleDeleteAsset(asset)}
                    type="button"
                  >
                    {deletingAssetId === asset.id ? '삭제 중' : '이미지 삭제'}
                  </button>
                </figure>
              ))}
            </div>
          ) : (
            <p className="admin-status">등록된 이미지가 없습니다.</p>
          )}
        </section>
      ) : null}
      <div className="setup-form-actions">
        <button className="admin-submit" disabled={isSavingRecord} type="submit">
          {isSavingRecord ? 'Saving...' : isEditing ? 'Update record' : 'Save record'}
        </button>
        {isEditing && onCancel ? (
          <button className="setup-card-expand" disabled={isSavingRecord} onClick={onCancel} type="button">
            취소
          </button>
        ) : null}
      </div>
      {recordStatus ? <p className="admin-status">{recordStatus}</p> : null}
    </form>
  );
}
