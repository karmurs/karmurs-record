# Handoff

## Read First

1. `D:\codex\projects\PROJECTS.md`
2. `D:\codex\projects\homepage\AGENTS.md`
3. `D:\codex\projects\homepage\README.md`
4. `D:\codex\projects\homepage\docs\CURRENT_STATE.md`
5. `D:\codex\projects\homepage\docs\deploy.md`

## Current Baseline

This project is a static personal homepage/archive called Karmurs' Record. It is already implemented as a Vite React TypeScript app with local seed data.

The current app is beyond the original three-card MVP. It intentionally keeps Devlog as a fourth primary section, alongside Journal, Gallery, and Racing. It also includes an aggregate Archive page, archive search/filtering, browser back navigation, and a Racing explorer.

The Racing explorer now consumes a generated read-only import snapshot from the sibling ACC, ACE, and LMU DeltaLine SQLite databases. ACE currently contributes 33 laps from 12 sessions; ACC and LMU DBs are present but currently empty.

New laps can be pulled manually with `npm run import:racing`, or refreshed while recording by keeping `npm run import:racing:watch` open.

The Racing UI also shows the last generated snapshot time in KST plus ACC/ACE/LMU import source statuses, so stale or empty imports are visible from the page.

## Standard Commands

```powershell
npm install
npm test
npm run import:racing
npm run import:racing:watch
npm run build
npm run dev
```

`npm run import:racing` writes `src\data\generated\racingLaps.json` from:

- `D:\codex\projects\acc-deltaline-v2\dist\ACC DeltaLine V2\data\acc_deltaline_v2.db`
- `D:\codex\projects\ace-deltaline-v2\dist\ACE DeltaLine V2\data\ace_deltaline_v2.db`
- `D:\codex\projects\lmu-deltaline\dist\LMU DeltaLine\data\lmu_deltaline.db`

Those sibling DBs are import sources only; do not modify them from this homepage project unless the user explicitly asks.

`npm run import:racing:watch` performs an initial import, then watches those DB files and regenerates the same JSON snapshot when they change. It is a user-started long-running command, not an auto-installed hook.

For deployment preview:

```powershell
npm run preview
```

## Verified State

Fresh checks run on 2026-05-18:

- `npm run import:racing`: passed, generated 33 total imported laps.
- `npm run import:racing:watch`: started successfully and performed the initial import in a short timed run.
- `npm test`: passed, 3 test files and 17 tests.
- `npm run build`: passed.
- Earlier browser QA at `http://127.0.0.1:5173/`: passed for homepage load, desktop 1280x720, mobile 390x844, Racing explorer interaction, LMU Race filter, and Archive search.
- Browser QA for the new imported racing panel was attempted, but the bundled Playwright package could not load `playwright-core` in this environment.
- Current seed content keeps one public-safe example record for each primary section.
- Racing import helper tests cover lap-time formatting, class inference, track filters, best laps, and trend derivation.

Run these again before claiming a new change is complete.

## Git And GitHub

- Current branch at handoff time: `main`
- Remote: `https://github.com/karmurs/karmurs-record.git`
- Planned GitHub Pages repo: `karmurs/karmurs-record`
- Deploy workflow: `.github/workflows/deploy.yml`

GitHub CLI auth was invalid for `karmurs` on 2026-05-18. Do not assume `gh` actions will work until re-authenticated.

## Working Rules

- Default response language is Korean.
- Keep changes surgical and verify before completion claims.
- Do not read or output secrets or env files.
- Treat `D:\codex\projects\homepage` as the only editable project root unless the user explicitly asks otherwise.
- Treat DeltaLine project databases as read-only import sources.
- Use current files as authority when they differ from older plans or summaries.
- Keep public content link-safe; `noindex,nofollow` is only a crawler request, not privacy protection.

## Likely Next Tasks

- Content pass:
  - Replace seed records with more specific real public-safe entries when ready.
  - Keep record data in `src/data/records.ts` until a file/database editing model is chosen.
- Deployment:
  - Re-authenticate GitHub CLI if needed.
  - Confirm GitHub Pages settings use GitHub Actions.
  - Push to `main` only after tests and build pass.
- Racing automation:
  - Decide whether the watcher should later be promoted to a scheduled automation.
  - Refine vehicle-class inference if the source DBs expose official categories later.

## Deferred Scope

- Login or password protection.
- Database-backed content.
- Upload UI.
- Admin editing UI.
- Full text search engine.
- Comments or guestbook.
- Automated capture imports.
- Detached scheduled racing import automation.
