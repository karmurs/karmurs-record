import { existsSync, watchFile } from 'node:fs';
import { importRacingLaps, sources } from './import-racing-laps.mjs';

const intervalMs = Number(process.env.RACING_IMPORT_WATCH_INTERVAL_MS ?? 2000);
const debounceMs = Number(process.env.RACING_IMPORT_DEBOUNCE_MS ?? 1000);
let importTimer = null;
let running = false;
let pendingReason = null;

function timestamp() {
  return new Date().toISOString();
}

function runImport(reason) {
  if (running) {
    pendingReason = reason;
    return;
  }

  running = true;

  try {
    const imported = importRacingLaps();
    console.log(
      `[${timestamp()}] ${reason}: imported ${imported.result.laps.length} laps -> ${imported.outputPath}`
    );
  } catch (error) {
    console.error(`[${timestamp()}] ${reason}: import failed`);
    console.error(error instanceof Error ? error.message : String(error));
  } finally {
    running = false;

    if (pendingReason) {
      const nextReason = pendingReason;
      pendingReason = null;
      scheduleImport(nextReason);
    }
  }
}

function scheduleImport(reason) {
  clearTimeout(importTimer);
  importTimer = setTimeout(() => runImport(reason), debounceMs);
}

console.log(`[${timestamp()}] Watching DeltaLine DBs for racing lap imports.`);
runImport('initial import');

for (const [gameId, source] of Object.entries(sources)) {
  if (!existsSync(source.databasePath)) {
    console.warn(`[${timestamp()}] ${gameId} DB is missing: ${source.databasePath}`);
  }

  watchFile(source.databasePath, { interval: intervalMs }, (current, previous) => {
    if (current.mtimeMs === previous.mtimeMs && current.size === previous.size) {
      return;
    }

    scheduleImport(`${gameId} database changed`);
  });
}
