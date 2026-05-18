# Current State

Last checked: 2026-05-18

## Project

- Name: Karmurs' Record
- Root: `D:\codex\projects\homepage`
- Role: Personal homepage and record archive
- Stack: Vite, React, TypeScript, Vitest, React Testing Library
- Planned public URL: `https://karmurs.github.io/karmurs-record/`

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

## Important Files

- `AGENTS.md`: project-level notes and direction.
- `README.md`: development, verification, and content entrypoint.
- `docs/deploy.md`: GitHub Pages and static host deployment notes.
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
- `src/components/RacingExplorer.tsx`: racing archive UI.
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
- `npm test`: passed, 3 test files and 17 tests.
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

## Next Recommended Work

1. Replace seed records with more specific real public-safe entries when ready.
2. Confirm GitHub Pages repository settings and GitHub CLI auth before deployment work.
3. Decide whether the racing watcher should later be promoted to a scheduled automation.
4. If editing content becomes frequent, choose file-first editing or an admin UI before adding persistence.
