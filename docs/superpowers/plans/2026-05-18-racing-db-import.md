# Racing DB Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Import ACE/ACC/LMU DeltaLine SQLite lap records into generated homepage data and render them by game and track in the Racing section.

**Architecture:** Add a read-only Node importer script that writes static JSON under `src/data/generated`. Add small TypeScript helpers for formatting, class inference, grouping, and chart data, then connect `RacingExplorer` to those helpers without changing the sibling racing projects.

**Tech Stack:** Vite, React, TypeScript, Vitest, Node child_process, sqlite3 CLI.

---

### Task 1: Add Racing Import Data Contract

**Files:**
- Create: `src/data/generated/racingLaps.json`
- Create: `src/data/importedRacingLaps.ts`
- Test: `src/test/importedRacingLaps.test.ts`

- [ ] Add failing tests for lap formatting, source summaries, track options, best laps, and selected-track trend.
- [ ] Implement helper types and functions.
- [ ] Add a fallback generated JSON file with empty sources.
- [ ] Run `npm test -- src/test/importedRacingLaps.test.ts`.

### Task 2: Add SQLite Import Script

**Files:**
- Create: `scripts/import-racing-laps.mjs`
- Modify: `package.json`

- [ ] Add `npm run import:racing`.
- [ ] Read ACE/ACC/LMU SQLite DBs with `sqlite3 -readonly -json`.
- [ ] Normalize ACC/LMU rows and ACE `session_phase` rows into one JSON schema.
- [ ] Generate `src/data/generated/racingLaps.json`.
- [ ] Run `npm run import:racing`.

### Task 3: Render Imported Racing Records

**Files:**
- Modify: `src/components/RacingExplorer.tsx`
- Modify: `src/styles.css`
- Test: `src/test/App.test.tsx`

- [ ] Add UI tests for ACE imported laps and track filtering.
- [ ] Render imported summary, track filter buttons, best-lap table, and simple charts.
- [ ] Preserve existing mock/catalog UI when a selected game has no imported laps.
- [ ] Run `npm test -- src/test/App.test.tsx`.

### Task 4: Verify

**Files:**
- Modify: `docs/CURRENT_STATE.md`
- Modify: `docs/HANDOFF.md`

- [ ] Document import command and read-only source paths.
- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Check `git status --short`.

### Task 5: Add Local Import Watcher

**Files:**
- Modify: `scripts/import-racing-laps.mjs`
- Create: `scripts/watch-racing-laps.mjs`
- Modify: `package.json`
- Modify: `README.md`
- Modify: `docs/CURRENT_STATE.md`
- Modify: `docs/HANDOFF.md`

- [ ] Export the one-shot importer as a reusable function.
- [ ] Add `npm run import:racing:watch`.
- [ ] Watch read-only DB source files and debounce JSON regeneration.
- [ ] Verify one-shot import still works.
- [ ] Verify the watcher starts and performs its initial import.
