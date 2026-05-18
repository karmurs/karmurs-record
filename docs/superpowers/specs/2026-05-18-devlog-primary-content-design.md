# Devlog Primary Content Design

## Goal

Keep Devlog as the fourth primary homepage section and make the seed content read like a deliberate public-safe archive, not temporary scaffold text.

## Decision

The homepage primary sections are:

- Journal: personal writing, diary-like notes, and short thoughts.
- Gallery: photos, screenshots, mood images, and visual collections.
- Racing: lap times, sessions, track notes, car notes, and racing records.
- Devlog: development notes for this homepage and other personal tools.

Devlog stays on the homepage because the site is itself an ongoing personal project. Build notes, deployment notes, and design decisions are records worth keeping alongside writing, images, and racing.

## Data Shape

Keep the existing `RecordEntry` structure in `src/data/records.ts`. Do not add a new database, markdown loader, or content framework yet.

The `primarySections` and `publicRecordTypes` exports must stay synchronized so Archive filters match the homepage entry points.

## Seed Content Rules

Seed records should be public-safe and reusable as examples:

- Avoid private names, secrets, tokens, account details, or unpublished personal data.
- Use real project language rather than placeholder wording.
- Keep one visible record for each primary section.
- Keep Racing sample values clearly non-authoritative unless they are verified real records.

## Testing

Add a regression test that `publicRecordTypes` equals the `primarySections` IDs. Keep the existing test that each primary section has at least one visible record.

## Documentation

Update current-state and handoff notes to record that Devlog is intentionally retained as the fourth primary section.
