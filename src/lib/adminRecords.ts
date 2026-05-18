import { getSupabaseClient } from './supabaseClient';
import type { RecordEntry } from '../data/records';

export type AdminRecordType = 'journal' | 'gallery' | 'racing' | 'devlog';
export type AdminRecordVisibility = 'public' | 'private' | 'draft';

export type AdminRecordFormState = {
  title: string;
  type: AdminRecordType;
  visibility: AdminRecordVisibility;
  summary: string;
  body: string;
  tags: string;
};

export type AdminRecordInsert = {
  slug: string;
  title: string;
  type: AdminRecordType;
  visibility: AdminRecordVisibility;
  summary: string;
  body: string;
  tags: string[];
  published_at: string | null;
  created_by: string;
};

export type AdminRecordUpdate = Omit<AdminRecordInsert, 'created_by'>;

export type AdminRecordRow = {
  id: string;
  title: string;
  type: AdminRecordType;
  visibility: AdminRecordVisibility;
  summary: string;
  body: string;
  tags: string[];
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminRecordAssetRow = {
  id: string;
  record_id: string;
  storage_bucket: string;
  storage_path: string;
  alt_text: string;
  caption: string;
  is_public: boolean;
  is_cover: boolean;
  created_at: string;
};

export type AdminRecordAsset = {
  id: string;
  recordId: string;
  storageBucket: string;
  storagePath: string;
  altText: string;
  caption: string;
  isPublic: boolean;
  isCover: boolean;
  createdAt: string;
  publicUrl: string;
};

type RecordAssetInsert = {
  record_id: string;
  storage_bucket: string;
  storage_path: string;
  alt_text: string;
  caption: string;
  is_public: boolean;
  is_cover: boolean;
  created_by: string;
};

const recordAssetsBucket = 'record-assets';

function toSlug(title: string) {
  const normalized = title
    .trim()
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!normalized) {
    return `record-${Date.now()}`;
  }

  return [...normalized]
    .map((char) => {
      const romanized: Record<string, string> = {
        오: 'o',
        늘: 'neul',
        의: 'yi',
        기: 'gi',
        록: 'rog'
      };

      return romanized[char] ?? char;
    })
    .join('');
}

function parseTags(tags: string) {
  return [...new Set(tags.split(',').map((tag) => tag.trim()).filter(Boolean))];
}

function sanitizeFileName(fileName: string) {
  const normalized = fileName
    .trim()
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || 'image';
}

export function buildAdminRecordInsert(
  formState: AdminRecordFormState,
  userId: string
): AdminRecordInsert {
  return {
    ...buildAdminRecordUpdate(formState),
    created_by: userId
  };
}

export function buildAdminRecordUpdate(formState: AdminRecordFormState): AdminRecordUpdate {
  return {
    slug: toSlug(formState.title),
    title: formState.title.trim(),
    type: formState.type,
    visibility: formState.visibility,
    summary: formState.summary.trim(),
    body: formState.body.trim(),
    tags: parseTags(formState.tags),
    published_at: formState.visibility === 'public' ? new Date().toISOString() : null
  };
}

export function recordEntryToAdminFormState(record: RecordEntry): AdminRecordFormState {
  return {
    title: record.title,
    type: record.type as AdminRecordType,
    visibility: record.adminVisibility ?? (record.visibility === 'link' ? 'public' : 'private'),
    summary: record.summary,
    body: record.body,
    tags: record.tags.join(', ')
  };
}

export function mapAdminRecordRow(row: AdminRecordRow): RecordEntry {
  const displayDate = row.published_at ?? row.created_at;

  return {
    id: `remote:${row.id}`,
    title: row.title,
    type: row.type,
    date: displayDate.slice(0, 10),
    summary: row.summary,
    body: row.body,
    tags: row.tags ?? [],
    visibility: row.visibility === 'public' ? 'link' : 'private',
    adminVisibility: row.visibility,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function mapAdminRecordAssetRow(row: AdminRecordAssetRow, publicUrl: string): AdminRecordAsset {
  return {
    id: row.id,
    recordId: row.record_id,
    storageBucket: row.storage_bucket,
    storagePath: row.storage_path,
    altText: row.alt_text,
    caption: row.caption,
    isPublic: row.is_public,
    isCover: row.is_cover,
    createdAt: row.created_at,
    publicUrl
  };
}

async function uploadRecordImages(
  recordId: string,
  formState: AdminRecordFormState,
  userId: string,
  imageFiles: File[]
) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { error: 'Supabase env is not configured.' };
  }

  const assetRows: RecordAssetInsert[] = [];

  for (const [index, file] of imageFiles.entries()) {
    const storagePath = `records/${recordId}/${Date.now()}-${index}-${sanitizeFileName(file.name)}`;
    const uploadResult = await supabase.storage.from(recordAssetsBucket).upload(storagePath, file, {
      cacheControl: '31536000',
      upsert: false
    });

    if (uploadResult.error) {
      return { error: uploadResult.error.message };
    }

    assetRows.push({
      record_id: recordId,
      storage_bucket: recordAssetsBucket,
      storage_path: storagePath,
      alt_text: formState.title.trim(),
      caption: '',
      is_public: formState.visibility === 'public',
      is_cover: false,
      created_by: userId
    });
  }

  if (assetRows.length > 0) {
    const assetResult = await supabase.from('record_assets').insert(assetRows);

    if (assetResult.error) {
      return { error: assetResult.error.message };
    }
  }

  return { error: null };
}

export async function saveAdminRecord(
  formState: AdminRecordFormState,
  userId: string,
  imageFiles: File[] = []
) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { error: 'Supabase env is not configured.' };
  }

  const payload = buildAdminRecordInsert(formState, userId);
  const { data, error } = await supabase.from('records').insert(payload).select('id').single();

  if (error) {
    return { error: error.message };
  }

  return uploadRecordImages(data.id as string, formState, userId, imageFiles);
}

export async function updateAdminRecord(
  recordId: string,
  formState: AdminRecordFormState,
  userId: string,
  imageFiles: File[] = []
) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { error: 'Supabase env is not configured.' };
  }

  const payload = buildAdminRecordUpdate(formState);
  const { error } = await supabase.from('records').update(payload).eq('id', recordId);

  if (error) {
    return { error: error.message };
  }

  return uploadRecordImages(recordId, formState, userId, imageFiles);
}

export async function deleteAdminRecord(recordId: string) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { error: 'Supabase env is not configured.' };
  }

  const { error } = await supabase.from('records').delete().eq('id', recordId);

  return { error: error?.message ?? null };
}

export async function fetchAdminRecords() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { records: [] as RecordEntry[], error: 'Supabase env is not configured.' };
  }

  const { data, error } = await supabase
    .from('records')
    .select('id,title,type,visibility,summary,body,tags,published_at,created_at,updated_at')
    .order('updated_at', { ascending: false });

  if (error) {
    return { records: [] as RecordEntry[], error: error.message };
  }

  return {
    records: ((data ?? []) as AdminRecordRow[]).map(mapAdminRecordRow),
    error: null
  };
}

export async function fetchAdminRecordAssets(recordId: string) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { assets: [] as AdminRecordAsset[], error: 'Supabase env is not configured.' };
  }

  const { data, error } = await supabase
    .from('record_assets')
    .select('id,record_id,storage_bucket,storage_path,alt_text,caption,is_public,is_cover,created_at')
    .eq('record_id', recordId)
    .order('is_cover', { ascending: false })
    .order('created_at', { ascending: true });

  if (error) {
    return { assets: [] as AdminRecordAsset[], error: error.message };
  }

  return {
    assets: ((data ?? []) as AdminRecordAssetRow[]).map((row) => {
      const publicUrl = supabase.storage.from(row.storage_bucket).getPublicUrl(row.storage_path).data.publicUrl;
      return mapAdminRecordAssetRow(row, publicUrl);
    }),
    error: null
  };
}

export async function deleteAdminRecordAsset(asset: AdminRecordAsset) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { error: 'Supabase env is not configured.' };
  }

  const storageResult = await supabase.storage.from(asset.storageBucket).remove([asset.storagePath]);

  if (storageResult.error) {
    return { error: storageResult.error.message };
  }

  const { error } = await supabase.from('record_assets').delete().eq('id', asset.id);

  return { error: error?.message ?? null };
}

export async function setAdminRecordCoverAsset(asset: AdminRecordAsset) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { error: 'Supabase env is not configured.' };
  }

  const clearResult = await supabase
    .from('record_assets')
    .update({ is_cover: false })
    .eq('record_id', asset.recordId);

  if (clearResult.error) {
    return { error: clearResult.error.message };
  }

  const { error } = await supabase.from('record_assets').update({ is_cover: true }).eq('id', asset.id);

  return { error: error?.message ?? null };
}
