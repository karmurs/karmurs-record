# Karmurs' Record

Personal homepage and record archive.

Planned public URL: `https://karmurs.github.io/karmurs-record/`

## Direction

Dark editorial personal site with a free handwritten hero phrase and three primary entry cards:

- Journal
- Gallery
- Racing

The site starts as a link-access personal record space. It should not be indexed by search engines in the first version.

The live primary cards are Journal, Gallery, Racing, and Devlog.

## Development

```bash
npm install
npm run dev
```

For Supabase-backed admin features, copy `.env.example` to `.env.local` and fill only the frontend-safe Supabase URL and anon key. See `docs/supabase.md`.

The admin shell is available at `/admin`. Without local Supabase env values it shows a setup notice instead of enabling sign-in.

## Verification

```bash
npm test
npm run build
```

## Racing Import

```bash
npm run import:racing
```

This refreshes `src/data/generated/racingLaps.json` from the read-only ACC, ACE, and LMU DeltaLine SQLite databases under `D:\codex\projects`.

To keep the generated racing data fresh while recording laps locally, run:

```bash
npm run import:racing:watch
```

The watcher performs an initial import, then regenerates the JSON snapshot when one of the source DB files changes.

## Devlog Drafts

Create a public-safe daily Codex work draft with:

```bash
npm run devlog:draft
```

The draft is written to `content/devlog/YYYY-MM-DD.md` with `draft: true`. It summarizes Git commits,
changed files, and verification notes while filtering obvious secret/env/token lines. This is the safe
draft stage before any future automatic Supabase upload.

Upload that markdown draft into the admin `records` table as a Devlog draft with:

```bash
npm run devlog:upload-draft
```

This uses the local admin login values in `.env.local`:

```text
CODEX_DEVLOG_ADMIN_EMAIL=
CODEX_DEVLOG_ADMIN_PASSWORD=
```

It signs in with the normal Supabase anon key and admin account, then upserts `codex-daily-YYYY-MM-DD`
as `type=devlog` and `visibility=draft`. It does not publish the post.

## Deployment

See `docs/deploy.md`.

## Content

Initial content lives in `src/data/records.ts`. Imported racing records are generated into `src/data/generated/racingLaps.json`.
