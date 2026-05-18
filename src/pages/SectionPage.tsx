import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { View } from '../App';
import AdminRecordForm from '../components/AdminRecordForm';
import RacingSetupForm from '../components/RacingSetupForm';
import RecordCard from '../components/RecordCard';
import RacingExplorer from '../components/RacingExplorer';
import RacingTuningGuidePanel from '../components/RacingTuningGuidePanel';
import SiteShell from '../components/SiteShell';
import type { RacingGameId } from '../data/racingRecords';
import { fetchRemotePublicRecords, mergePublicRecords } from '../data/remoteRecords';
import {
  fetchPublicRacingSetups,
  type RacingSetup,
  type RacingSetupVisibility
} from '../data/racingSetups';
import {
  getPublicRecords,
  getRecordsByType,
  primarySections,
  publicRecordTypes,
  type RecordEntry,
  type RecordType
} from '../data/records';
import { getAdminSession, isSupabaseConfigured, onAdminAuthChange } from '../lib/adminAuth';
import { deleteAdminRecord } from '../lib/adminRecords';
import type { AdminRecordType } from '../lib/adminRecords';

type ArchiveFilter = 'all' | (typeof publicRecordTypes)[number];

const sectionCopy: Record<RecordType, { title: string; description: string }> = {
  journal: {
    title: 'Journal',
    description: '하루의 생각과 다시 읽고 싶은 문장을 가볍게 남기는 공간.'
  },
  gallery: {
    title: 'Gallery',
    description: '사진, 캡처, 장면처럼 말보다 먼저 남는 것들을 보관하는 공간.'
  },
  racing: {
    title: 'Racing',
    description: 'ACC, ACE, LMU의 랩타임과 셋업 메모를 트랙별로 정리하는 공간.'
  },
  devlog: {
    title: 'Devlog',
    description: '홈페이지와 개인 도구가 어떻게 바뀌었는지 남기는 업데이트 기록.'
  },
  archive: {
    title: 'Archive',
    description: '글, 사진, 링크, 작업 기록을 한 번에 다시 찾기 위한 기록함.'
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
  const [remoteRecords, setRemoteRecords] = useState<RecordEntry[]>([]);
  const [remoteError, setRemoteError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RecordEntry | null>(null);
  const [recordActionStatus, setRecordActionStatus] = useState('');
  const [isSetupFormOpen, setIsSetupFormOpen] = useState(false);
  const [setupPageFocus, setSetupPageFocus] = useState<{
    focusNewest: boolean;
    game: RacingGameId;
    nonce: number;
  } | null>(null);
  const [racingSetups, setRacingSetups] = useState<RacingSetup[]>([]);
  const [racingSetupsError, setRacingSetupsError] = useState<string | null>(null);
  const sectionInfo = sectionCopy[section];
  const canWriteInSection = publicRecordTypes.includes(section as (typeof publicRecordTypes)[number]);
  const publicRecords = useMemo(
    () => mergePublicRecords(getPublicRecords(), remoteRecords),
    [remoteRecords]
  );
  const archiveRecords = publicRecords;
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
      : mergePublicRecords(
          getRecordsByType(section),
          remoteRecords.filter((record) => record.type === section)
        );
  const primarySection = primarySections.find((item) => item.id === section);
  const archiveFilterOptions = [
    { id: 'all' as const, label: 'All', count: archiveRecords.length },
    ...publicRecordTypes.map((type) => ({
      id: type,
      label: sectionCopy[type].title,
      count: archiveRecords.filter((record) => record.type === type).length
    }))
  ];
  const refreshRemoteRecords = useCallback(async () => {
    const result = await fetchRemotePublicRecords();
    setRemoteRecords(result.records);
    setRemoteError(result.error);
  }, []);
  const refreshRacingSetups = useCallback(async () => {
    const result = await fetchPublicRacingSetups();
    setRacingSetups(result.setups);
    setRacingSetupsError(result.error);
  }, []);
  const handleRacingSetupSaved = useCallback(
    async (savedSetup: { game: RacingGameId; visibility: RacingSetupVisibility }) => {
      await refreshRacingSetups();

      if (savedSetup.visibility === 'public') {
        setSetupPageFocus({ focusNewest: true, game: savedSetup.game, nonce: Date.now() });
        setIsSetupFormOpen(false);
      }
    },
    [refreshRacingSetups]
  );
  const handleRemoteRecordDeleted = useCallback(
    async (record: RecordEntry) => {
      const recordId = record.id.startsWith('remote:') ? record.id.replace('remote:', '') : null;

      if (!recordId) {
        return;
      }

      const shouldDelete = window.confirm(`"${record.title}" 글을 삭제할까요?`);

      if (!shouldDelete) {
        return;
      }

      setRecordActionStatus('');
      const result = await deleteAdminRecord(recordId);

      if (result.error) {
        setRecordActionStatus(result.error);
        return;
      }

      if (editingRecord?.id === record.id) {
        setEditingRecord(null);
      }
      await refreshRemoteRecords();
      setRecordActionStatus('Record deleted.');
    },
    [editingRecord, refreshRemoteRecords]
  );

  useEffect(() => {
    let isMounted = true;

    fetchRemotePublicRecords().then((result) => {
      if (!isMounted) {
        return;
      }

      setRemoteRecords(result.records);
      setRemoteError(result.error);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (!isSupabaseConfigured) {
      return undefined;
    }

    getAdminSession().then((result) => {
      if (isMounted) {
        setSession(result.session);
      }
    });

    const unsubscribe = onAdminAuthChange((nextSession) => {
              setSession(nextSession);
              if (!nextSession) {
                setIsComposerOpen(false);
                setEditingRecord(null);
                setIsSetupFormOpen(false);
              }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (section !== 'racing') {
      return undefined;
    }

    fetchPublicRacingSetups().then((result) => {
      if (!isMounted) {
        return;
      }

      setRacingSetups(result.setups);
      setRacingSetupsError(result.error);
    });

    return () => {
      isMounted = false;
    };
  }, [section]);

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

        {session && canWriteInSection ? (
          <section className="inline-compose" aria-label="Inline record composer">
            <button
              aria-expanded={isComposerOpen}
              className="admin-compose-toggle"
              onClick={() => setIsComposerOpen((current) => !current)}
              type="button"
            >
              {isComposerOpen ? '작성 닫기' : `${sectionInfo.title} 새 글 작성`}
            </button>
            {isComposerOpen ? (
              <AdminRecordForm
                initialType={section as AdminRecordType}
                onSaved={refreshRemoteRecords}
                userId={session.user.id}
              />
            ) : null}
          </section>
        ) : null}

        {session && editingRecord ? (
          <section className="inline-compose" aria-label="Inline record editor">
            <AdminRecordForm
              initialRecord={editingRecord}
              onCancel={() => setEditingRecord(null)}
              onSaved={async () => {
                setEditingRecord(null);
                await refreshRemoteRecords();
                setRecordActionStatus('Record updated.');
              }}
              userId={session.user.id}
            />
          </section>
        ) : null}

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

        {remoteError ? (
          <p className="remote-record-status">Supabase records could not be loaded: {remoteError}</p>
        ) : null}
        {recordActionStatus ? <p className="admin-status">{recordActionStatus}</p> : null}

        {section === 'racing' ? (
          <>
            {session ? (
              <section className="inline-compose" aria-label="Inline racing setup composer">
                <button
                  aria-expanded={isSetupFormOpen}
                  className="admin-compose-toggle"
                  onClick={() => setIsSetupFormOpen((current) => !current)}
                  type="button"
                >
                  {isSetupFormOpen ? '셋업 입력 닫기' : '차량 셋업 입력'}
                </button>
                {isSetupFormOpen ? (
                  <RacingSetupForm onSaved={handleRacingSetupSaved} userId={session.user.id} />
                ) : null}
              </section>
            ) : null}
            <RacingTuningGuidePanel />
            <RacingExplorer
              adminUserId={session?.user.id}
              focusSetupPage={setupPageFocus}
              onRacingSetupsChanged={refreshRacingSetups}
              racingSetups={racingSetups}
              racingSetupsError={racingSetupsError}
            />
          </>
        ) : records.length > 0 ? (
          <div className="record-grid">
            {records.map((record) => (
              <RecordCard
                canManage={Boolean(session)}
                key={record.id}
                onDelete={(targetRecord) => void handleRemoteRecordDeleted(targetRecord)}
                onEdit={(targetRecord) => {
                  setRecordActionStatus('');
                  setEditingRecord(targetRecord);
                  setIsComposerOpen(false);
                }}
                onNavigate={onNavigate}
                record={record}
              />
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
