# Current State

Last checked: 2026-05-18

## Project

- Name: Karmurs' Record
- Root: `D:\codex\projects\homepage`
- Role: Personal homepage and record archive
- Stack: Vite, React, TypeScript, Vitest, React Testing Library
- Planned public URL: `https://karmurs.github.io/karmurs-record/`
- Supabase project: `karmurs-homepage`
- Supabase GitHub integration: connected

## Implemented

- Static Vite React app with in-memory view navigation.
- Dark editorial homepage with handwritten-style hero phrase:
  - `Things worth keeping`
  - `in my record`
- Primary homepage sections:
  - Journal
  - Gallery
  - Racing
  - Devlog
- Devlog is intentionally retained as the fourth primary section because development notes are part of the personal archive.
- Floating quick navigation:
  - 오늘
  - 사진
  - 레이싱
  - 개발
  - 기록함
- Local seed records in `src/data/records.ts`.
- Section list pages and record detail pages.
- Archive page with aggregate records, type filters, and text/tag search.
- Random discovery prompt that opens a seeded gallery record.
- Browser history support for back navigation between app views.
- Racing explorer with:
  - ACC, ACE, and LMU game groups.
  - Sessions, tracks, and cars menus.
  - Session type filters.
  - Local track/car images and brand SVG assets.
  - Read-only DeltaLine DB import from the sibling ACC, ACE, and LMU projects.
  - Imported lap summaries, course filters, best-lap table, best-lap bar chart, and selected-course lap trend.
  - Current imported snapshot: ACE has 33 laps from 12 sessions; ACC and LMU source DBs are present but empty.
- Optional local watcher command that refreshes generated racing data when source DB files change.
- Racing UI shows the last generated snapshot time and ACC/ACE/LMU import source statuses.
- Supabase local env template in `.env.example`; actual `.env.local` remains ignored by Git.
- Protected `/admin` shell with Supabase Auth session checking, email/password sign-in form, and sign-out action.
- `/admin` shows a setup notice instead of a live login form when Supabase env values are missing.
- `/admin` signed-in view includes a new record form that saves Journal, Gallery, Racing, or Devlog records to Supabase `records`.
- Public Supabase `records` are fetched and merged with seed records on Journal, Gallery, Devlog, and Archive pages.
- Supabase migration drafts for admin CMS tables, racing tables, daily Codex logs, and record asset storage policies.
- Supabase migration safety test for order, RLS coverage, and secret-free SQL.
- Racing setup visuals use a Blender-rendered Mercedes-AMG GT4 top-view PNG generated from the project-owner supplied GLB package.

## Important Files

- `AGENTS.md`: project-level notes and direction.
- `README.md`: development, verification, and content entrypoint.
- `docs/deploy.md`: GitHub Pages and static host deployment notes.
- `docs/supabase.md`: Supabase setup, safe env variables, and planned data areas.
- `supabase/migrations/202605180001_admin_cms_schema.sql`: CMS, racing, setup, and daily log tables with RLS policies.
- `supabase/migrations/202605180002_storage_policies.sql`: `record-assets` bucket and admin-only write policies.
- `docs/image-attributions.md`: local racing image and SVG attribution table.
- `docs/superpowers/specs/2026-05-16-karmurs-record-design.md`: original design spec.
- `docs/superpowers/specs/2026-05-18-devlog-primary-content-design.md`: Devlog primary-section decision and seed content rules.
- `docs/superpowers/specs/2026-05-18-racing-db-import-design.md`: racing DB import and visualization design.
- `docs/superpowers/plans/2026-05-16-karmurs-record-mvp.md`: original MVP implementation plan.
- `docs/superpowers/plans/2026-05-18-devlog-primary-content.md`: implementation plan for Devlog seed content cleanup.
- `docs/superpowers/plans/2026-05-18-racing-db-import.md`: implementation plan for imported lap-time records.
- `scripts/import-racing-laps.mjs`: read-only importer that generates racing lap JSON from sibling project SQLite DBs.
- `src/App.tsx`: in-memory navigation and browser history.
- `src/data/records.ts`: record type definitions and seed records.
- `src/data/racingRecords.ts`: racing session seed data.
- `src/data/racingCatalog.ts`: racing track/car catalog and brand asset paths.
- `src/data/importedRacingLaps.ts`: imported racing lap helpers and chart/table derivations.
- `src/data/generated/racingLaps.json`: generated import snapshot consumed by the frontend.
- `src/test/supabaseMigrations.test.ts`: migration safety checks.
- `src/lib/adminRecords.ts`: admin record payload builder and Supabase insert helper.
- `src/test/adminRecords.test.ts`: admin record insert payload coverage.
- `src/data/remoteRecords.ts`: Supabase public record fetcher and mapping helpers.
- `src/test/remoteRecords.test.ts`: remote record mapping and merge coverage.
- `src/components/RacingExplorer.tsx`: racing archive UI.
- `src/components/SetupCarVisual.tsx`: setup vehicle visual component backed by the rendered top-view PNG.
- `scripts/blender-render-setup-model.py`: imports a GLB in Blender and renders a transparent top-view setup PNG.
- `src/styles.css`: global visual design.

## Racing Import

Generate the public-safe racing snapshot with:

```powershell
npm run import:racing
```

While recording new laps locally, keep the generated snapshot fresh with:

```powershell
npm run import:racing:watch
```

The watcher performs an initial import, then watches the three source DB files and regenerates the JSON snapshot after a change. It only runs while the command is open.

The importer reads these DBs without modifying them:

- `D:\codex\projects\acc-deltaline-v2\dist\ACC DeltaLine V2\data\acc_deltaline_v2.db`
- `D:\codex\projects\ace-deltaline-v2\dist\ACE DeltaLine V2\data\ace_deltaline_v2.db`
- `D:\codex\projects\lmu-deltaline\dist\LMU DeltaLine\data\lmu_deltaline.db`

It writes `src\data\generated\racingLaps.json`, which the homepage uses for the Racing session view. The UI displays the snapshot time in KST and shows each game's import status.

## Verification

Fresh verification on 2026-05-18:

- `npm run import:racing`: passed, generated 33 total imported laps.
- `npm test`: passed, 6 test files and 26 tests.
- `npm run build`: passed, Vite production build generated `dist/`.
- Earlier browser QA at `http://127.0.0.1:5173/`: passed for homepage load, desktop 1280x720, mobile 390x844, Racing explorer interaction, LMU Race filter, and Archive search.
- Browser QA for the new imported racing panel was attempted, but the bundled Playwright package could not load `playwright-core` in this environment.

## Known Gaps

- `docs/superpowers/specs/2026-05-16-karmurs-record-design.md` describes the first cards as Journal, Gallery, and Racing; the current implementation intentionally keeps Devlog as a fourth primary section.
- GitHub CLI auth for account `karmurs` was invalid on 2026-05-18. GitHub operations may require `gh auth login -h github.com`.
- The site uses `noindex,nofollow`, but this is not access control. Do not add private data to public seed records.
- Racing images and brand SVGs are local static assets with attributions; they are not official game, manufacturer, or series assets.
- The racing import can be refreshed manually or by running the local watcher. A detached scheduled automation has not been added yet.
- Vehicle class inference is heuristic and should be refined if the game DBs start providing first-class category data.
- Supabase schema/RLS migrations are drafted but not applied to the remote project yet.
- Admin login UI is implemented, but live sign-in is unverified until `.env.local`, Supabase Auth user setup, and policies are configured.
- Admin record save UI is implemented, but live insert should be verified from `/admin` after confirming RLS/admin profile setup.
- Supabase records must be saved as `public` before they appear on public pages; `draft` and `private` remain hidden by RLS/query filters.
- Direct `/admin` deep links may need static-host fallback handling before public deployment.
- The Mercedes-AMG GT4 render source package license is pending review; verify before public deployment.

## Next Recommended Work

1. Replace seed records with more specific real public-safe entries when ready.
2. Add Supabase client setup after `.env.local` is filled with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Configure Supabase Auth user and verify live `/admin` sign-in locally.
4. Apply and verify Supabase schema/storage migrations in the Supabase project.
5. Confirm GitHub Pages repository settings and GitHub CLI auth before deployment work.
6. Decide whether the racing watcher should later be promoted to a scheduled automation.
