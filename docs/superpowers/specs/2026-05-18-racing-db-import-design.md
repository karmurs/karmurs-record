# Racing DB Import Design

## Goal

Show lap records from ACE, ACC, and LMU DeltaLine inside the homepage Racing section, grouped by game and selectable by track.

## Source Boundary

The homepage reads source SQLite databases in read-only mode and never modifies sibling racing projects.

Default source databases:

- ACE: `D:\codex\projects\ace-deltaline-v2\dist\ACE DeltaLine V2\data\ace_deltaline_v2.db`
- ACC: `D:\codex\projects\acc-deltaline-v2\dist\ACC DeltaLine V2\data\acc_deltaline_v2.db`
- LMU: `D:\codex\projects\lmu-deltaline\dist\LMU DeltaLine\data\lmu_deltaline.db`

## Data Flow

1. `npm run import:racing` runs a Node script.
2. The script calls `sqlite3` with read-only database access.
3. The script writes `src/data/generated/racingLaps.json`.
4. The React app reads that generated JSON at build/runtime.
5. GitHub Pages serves the generated static data; it never connects to local SQLite directly.

## Homepage Behavior

In `Racing`:

- The user chooses `ACC`, `ACE`, or `LMU`.
- The selected game shows imported lap counts and session counts.
- The user can select a track/course from that game.
- The table and charts update to the selected track.
- If a game has no imported laps, the existing catalog/mock view remains visible and the imported section shows an empty state.

## Visualization

MVP visualizations:

- Track best lap bar chart.
- Selected track lap trend.
- Best laps table by track, car, class, best lap, and latest run.

Vehicle class is inferred from simple homepage-side name rules. Unknown cars use `Unknown` and can be mapped later.
