import { getSupabaseClient } from '../lib/supabaseClient';
import type { RecordEntry, RecordType } from './records';

export type RemoteRecordRow = {
  id: string;
  title: string;
  type: RecordType;
  summary: string;
  body: string;
  tags: string[];
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type RemoteAssetRow = {
  record_id: string;
  storage_bucket: string;
  storage_path: string;
  alt_text: string;
  is_cover: boolean;
};

const imageToneByType: Partial<Record<RecordType, RecordEntry['imageTone']>> = {
  devlog: 'dev',
  gallery: 'mono',
  journal: 'warm',
  racing: 'racing'
};

export function mapRemoteRecord(row: RemoteRecordRow, asset?: RemoteAssetRow): RecordEntry {
  const publishedAt = row.published_at ?? row.created_at;
  const supabase = getSupabaseClient();
  const coverImageUrl =
    asset && supabase
      ? supabase.storage.from(asset.storage_bucket).getPublicUrl(asset.storage_path).data.publicUrl
      : undefined;

  return {
    id: `remote:${row.id}`,
    title: row.title,
    type: row.type,
    date: publishedAt.slice(0, 10),
    summary: row.summary,
    body: row.body,
    tags: row.tags ?? [],
    visibility: 'link',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    imageTone: imageToneByType[row.type] ?? 'warm',
    ...(coverImageUrl ? { coverImageUrl, coverImageAlt: asset?.alt_text || row.title } : {})
  };
}

export function mergePublicRecords(seedRecords: RecordEntry[], remoteRecords: RecordEntry[]) {
  return [...remoteRecords, ...seedRecords]
    .filter((record) => record.visibility === 'link')
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
}

export async function fetchRemotePublicRecords() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { records: [] as RecordEntry[], error: null };
  }

  const { data, error } = await supabase
    .from('records')
    .select('id,title,type,summary,body,tags,published_at,created_at,updated_at')
    .eq('visibility', 'public')
    .order('published_at', { ascending: false });

  if (error) {
    return { records: [] as RecordEntry[], error: error.message };
  }

  const rows = (data ?? []) as RemoteRecordRow[];
  const recordIds = rows.map((row) => row.id);
  const assetsByRecordId = new Map<string, RemoteAssetRow>();

  if (recordIds.length > 0) {
    const assetResult = await supabase
      .from('record_assets')
      .select('record_id,storage_bucket,storage_path,alt_text,is_cover')
      .in('record_id', recordIds)
      .eq('is_public', true)
      .order('is_cover', { ascending: false })
      .order('created_at', { ascending: true });

    if (assetResult.error) {
      return { records: [] as RecordEntry[], error: assetResult.error.message };
    }

    for (const asset of (assetResult.data ?? []) as RemoteAssetRow[]) {
      if (!assetsByRecordId.has(asset.record_id)) {
        assetsByRecordId.set(asset.record_id, asset);
      }
    }
  }

  return {
    records: rows.map((row) => mapRemoteRecord(row, assetsByRecordId.get(row.id))),
    error: null
  };
}
