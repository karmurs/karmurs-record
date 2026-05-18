# Supabase Setup

This project uses Supabase for the planned admin CMS, uploads, racing setup storage, and daily Devlog automation.

## Project

- Supabase project name: `karmurs-homepage`
- GitHub integration: connected from Supabase project setup
- Region: Asia-Pacific

## Local Environment

Create `D:\codex\projects\homepage\.env.local` from `.env.example`:

```powershell
Copy-Item .env.example .env.local
```

Fill only these frontend-safe values from Supabase Project Settings:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

`VITE_SUPABASE_URL` must be the project base URL only:

```text
https://PROJECT_REF.supabase.co
```

Do not use a Supabase dashboard URL, SQL editor URL, `/auth/v1`, or `/rest/v1` URL.

For the local daily Devlog draft uploader, also fill:

```text
CODEX_DEVLOG_ADMIN_EMAIL=
CODEX_DEVLOG_ADMIN_PASSWORD=
```

Those two values are local automation credentials only. Do not add them to a public frontend deployment.

Do not put the database password, JWT secret, or `service_role` key in `.env.local`, frontend code, docs, or Git.

## Security Defaults

- Keep Row Level Security enabled for user content tables.
- Do not automatically expose new tables without reviewing policies.
- Admin-only writes should be enforced with RLS policies, not just hidden UI.
- Public reads should only expose approved records, public image metadata, published Devlog entries, and safe racing summaries.

## Planned Data Areas

- `profiles`: one admin profile for the site owner.
- `records`: Journal, Gallery, Racing, and Devlog entries.
- `record_assets`: uploaded images and files linked to records.
- `racing_laps`: imported lap summaries from ACC, ACE, and LMU.
- `racing_setups`: manually entered vehicle setup sheets.
- `codex_daily_logs`: one public-safe daily summary generated from Codex/Git activity.

## Schema Migrations

SQL drafts live in:

```text
supabase/migrations/202605180001_admin_cms_schema.sql
supabase/migrations/202605180002_storage_policies.sql
supabase/migrations/202605180003_table_grants.sql
supabase/migrations/202605180004_record_asset_cover.sql
```

Apply them from the Supabase SQL editor or a reviewed migration workflow after confirming the project is still empty enough for a first schema pass.

Before applying, run:

```powershell
npm test -- src/test/supabaseMigrations.test.ts
```

Expected result: migration order is fixed, public tables have RLS enabled, and migration SQL does not include secrets or project-specific credentials.

Apply in this order:

1. `202605180001_admin_cms_schema.sql`
2. `202605180002_storage_policies.sql`
3. `202605180003_table_grants.sql`
4. `202605180004_record_asset_cover.sql`

If Supabase reports that a type, table, bucket, or policy already exists, stop and inspect the remote state before editing the SQL. Do not blindly delete remote tables with real content.

After creating the owner in Supabase Authentication, register that user as the site admin:

```sql
insert into public.admin_profiles (user_id, display_name)
select id, 'Karmurs'
from auth.users
where email = 'YOUR_ADMIN_EMAIL_HERE'
on conflict (user_id) do nothing;
```

Replace `YOUR_ADMIN_EMAIL_HERE` in Supabase SQL editor. Do not commit a real email if you prefer to keep it private.

## Storage

- Bucket: `record-assets`
- Public file reads are enabled for files in this bucket.
- Upload, update, and delete are restricted to users listed in `admin_profiles`.

## Implemented Local Flow

The Supabase client, protected `/admin` shell, record writing, image upload, racing setup storage, and daily Devlog draft uploader are implemented. Public records appear on the matching public page only when saved as `public`; `draft` and `private` remain visible only in admin workflows.
