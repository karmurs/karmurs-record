import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const outputPath = resolve(repoRoot, 'src/data/generated/racingLaps.json');
const sqlitePath = process.env.SQLITE3_PATH ?? 'D:\\codex\\tools\\bin\\sqlite3.exe';

export const sources = {
  acc: {
    databasePath:
      'D:\\codex\\projects\\acc-deltaline-v2\\dist\\ACC DeltaLine V2\\data\\acc_deltaline_v2.db',
    hasSessionPhase: false
  },
  ace: {
    databasePath:
      'D:\\codex\\projects\\ace-deltaline-v2\\dist\\ACE DeltaLine V2\\data\\ace_deltaline_v2.db',
    hasSessionPhase: true
  },
  lmu: {
    databasePath: 'D:\\codex\\projects\\lmu-deltaline\\dist\\LMU DeltaLine\\data\\lmu_deltaline.db',
    hasSessionPhase: false
  }
};

function inferVehicleClass(vehicle) {
  const normalized = vehicle.toLowerCase();

  if (normalized.includes('gt3') || normalized.includes('lmgt3')) {
    return 'GT3';
  }

  if (normalized.includes('challenge')) {
    return 'Challenge';
  }

  if (
    normalized.includes('i30') ||
    normalized.includes('hatchback') ||
    normalized.includes('road') ||
    normalized.includes('street')
  ) {
    return 'Road';
  }

  if (normalized.includes('gti') || normalized.includes('clubsport')) {
    return 'Touring';
  }

  if (normalized.includes('hypercar') || normalized.includes('499p') || normalized.includes('963')) {
    return 'Hypercar';
  }

  return 'Unknown';
}

function readJson(databasePath, sql) {
  const output = execFileSync(sqlitePath, ['-readonly', '-json', databasePath, sql], {
    encoding: 'utf8'
  });

  return output.trim() ? JSON.parse(output) : [];
}

function readSource(gameId, source) {
  if (!existsSync(source.databasePath)) {
    return {
      summary: {
        databasePath: source.databasePath,
        lapCount: 0,
        sessionCount: 0,
        status: 'missing'
      },
      laps: []
    };
  }

  const sessionPhaseSelect = source.hasSessionPhase ? 'session_phase,' : "'' AS session_phase,";
  const rows = readJson(
    source.databasePath,
    `SELECT id, session_id, lap_number, lap_time_ms, sector1_ms, sector2_ms, sector3_ms, weather, vehicle, track, session_type, ${sessionPhaseSelect} recorded_at, source_name FROM laps ORDER BY recorded_at ASC, id ASC;`
  );
  const counts = readJson(
    source.databasePath,
    "SELECT (SELECT COUNT(*) FROM laps) AS lapCount, (SELECT COUNT(*) FROM sessions) AS sessionCount;"
  )[0] ?? { lapCount: 0, sessionCount: 0 };
  const laps = rows.map((row) => ({
    id: `${gameId}-${row.id}`,
    gameId,
    sourceId: Number(row.id),
    sessionId: row.session_id === null || row.session_id === undefined ? null : Number(row.session_id),
    lapNumber: Number(row.lap_number),
    lapTimeMs: Number(row.lap_time_ms),
    sector1Ms: Number(row.sector1_ms),
    sector2Ms: Number(row.sector2_ms),
    sector3Ms: Number(row.sector3_ms),
    weather: row.weather,
    vehicle: row.vehicle,
    vehicleClass: inferVehicleClass(row.vehicle),
    track: row.track,
    sessionType: row.session_type,
    sessionPhase: row.session_phase ?? '',
    recordedAt: row.recorded_at,
    sourceName: row.source_name
  }));

  return {
    summary: {
      databasePath: source.databasePath,
      lapCount: Number(counts.lapCount),
      sessionCount: Number(counts.sessionCount),
      status: laps.length > 0 ? 'imported' : 'empty'
    },
    laps
  };
}

export function importRacingLaps() {
  const result = {
    generatedAt: new Date().toISOString(),
    sources: {},
    laps: []
  };

  for (const [gameId, source] of Object.entries(sources)) {
    try {
      const imported = readSource(gameId, source);
      result.sources[gameId] = imported.summary;
      result.laps.push(...imported.laps);
    } catch (error) {
      result.sources[gameId] = {
        databasePath: source.databasePath,
        lapCount: 0,
        sessionCount: 0,
        status: 'error',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');

  return { outputPath, result };
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  const imported = importRacingLaps();
  console.log(`Imported racing laps: ${imported.result.laps.length} total -> ${imported.outputPath}`);
}
