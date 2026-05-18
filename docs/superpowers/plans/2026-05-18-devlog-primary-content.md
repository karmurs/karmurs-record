# Devlog Primary Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep Devlog as a deliberate primary homepage section and tighten the public-safe seed content around the four-section archive model.

**Architecture:** Keep the existing static Vite React data model. Update only seed data, small regression tests, and state/handoff docs; do not add persistence or new UI surfaces.

**Tech Stack:** Vite, React, TypeScript, Vitest.

---

### Task 1: Lock Primary Section Data Contract

**Files:**
- Modify: `src/test/records.test.ts`
- Modify: `src/data/records.ts`

- [ ] **Step 1: Write the failing test**

Add a test asserting `publicRecordTypes` matches `primarySections.map((section) => section.id)`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/test/records.test.ts`

Expected: FAIL because `publicRecordTypes` is not imported in the test file yet.

- [ ] **Step 3: Update the import**

Import `publicRecordTypes` from `../data/records`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/test/records.test.ts`

Expected: PASS.

### Task 2: Tighten Public-Safe Seed Content

**Files:**
- Modify: `src/data/records.ts`
- Test: `src/test/records.test.ts`

- [ ] **Step 1: Rewrite the four seed records**

Update titles, summaries, bodies, and tags so Journal, Gallery, Racing, and Devlog read as intentional public-safe examples.

- [ ] **Step 2: Run targeted tests**

Run: `npm test -- src/test/records.test.ts`

Expected: PASS.

### Task 3: Update Handoff Docs

**Files:**
- Modify: `docs/CURRENT_STATE.md`
- Modify: `docs/HANDOFF.md`

- [ ] **Step 1: Record the Devlog decision**

State that Devlog is intentionally kept as the fourth primary section.

- [ ] **Step 2: Run final verification**

Run:

```powershell
npm test
npm run build
git status --short
```

Expected: tests pass, build passes, and only intentional files are changed.
