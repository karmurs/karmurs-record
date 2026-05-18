import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const migrationsDir = resolve(process.cwd(), 'supabase/migrations');
const migrationFiles = readdirSync(migrationsDir).filter((file) => file.endsWith('.sql')).sort();

describe('Supabase migrations', () => {
  it('keeps migrations ordered and present', () => {
    expect(migrationFiles).toEqual([
      '202605180001_admin_cms_schema.sql',
      '202605180002_storage_policies.sql',
      '202605180003_table_grants.sql',
      '202605180004_record_asset_cover.sql'
    ]);
  });

  it('does not commit secrets or private credentials in SQL', () => {
    const combinedSql = migrationFiles
      .map((file) => readFileSync(resolve(migrationsDir, file), 'utf8'))
      .join('\n');

    expect(combinedSql).not.toMatch(/service_role/i);
    expect(combinedSql).not.toMatch(/jwt_secret/i);
    expect(combinedSql).not.toMatch(/database password/i);
    expect(combinedSql).not.toMatch(/supabase\.co/i);
  });

  it('enables row level security on public tables', () => {
    const schemaSql = readFileSync(
      resolve(migrationsDir, '202605180001_admin_cms_schema.sql'),
      'utf8'
    );

    for (const table of [
      'admin_profiles',
      'records',
      'record_assets',
      'racing_laps',
      'racing_setups',
      'codex_daily_logs'
    ]) {
      expect(schemaSql).toContain(`alter table public.${table} enable row level security;`);
    }
  });

  it('grants frontend-safe table access to Supabase API roles', () => {
    const grantsSql = readFileSync(
      resolve(migrationsDir, '202605180003_table_grants.sql'),
      'utf8'
    );

    expect(grantsSql).toContain('grant usage on schema public to anon, authenticated;');
    expect(grantsSql).toContain('grant select');
    expect(grantsSql).toContain('to anon, authenticated;');
    expect(grantsSql).toContain('grant insert, update, delete');
    expect(grantsSql).toContain('to authenticated;');
  });

  it('supports choosing a cover image for record assets', () => {
    const coverSql = readFileSync(
      resolve(migrationsDir, '202605180004_record_asset_cover.sql'),
      'utf8'
    );

    expect(coverSql).toContain('alter table public.record_assets');
    expect(coverSql).toContain('add column if not exists is_cover boolean not null default false');
    expect(coverSql).toContain('record_assets_one_cover_per_record');
  });
});
