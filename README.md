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

## Deployment

See `docs/deploy.md`.

## Content

Initial content lives in `src/data/records.ts`. Imported racing records are generated into `src/data/generated/racingLaps.json`.
