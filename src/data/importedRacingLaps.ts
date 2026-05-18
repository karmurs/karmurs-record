import importedRacingData from './generated/racingLaps.json';
import type { RacingGameId } from './racingRecords';

export type ImportedRacingSourceSummary = {
  databasePath: string;
  lapCount: number;
  sessionCount: number;
  status: 'imported' | 'empty' | 'missing' | 'error';
  error?: string;
};

export type ImportedRacingLap = {
  id: string;
  gameId: RacingGameId;
  sourceId: number;
  lapNumber: number;
  lapTimeMs: number;
  sector1Ms: number;
  sector2Ms: number;
  sector3Ms: number;
  weather: string;
  vehicle: string;
  vehicleClass: string;
  track: string;
  sessionType: string;
  sessionPhase?: string;
  recordedAt: string;
  sourceName: string;
};

export type ImportedRacingData = {
  generatedAt: string | null;
  sources: Record<RacingGameId, ImportedRacingSourceSummary>;
  laps: ImportedRacingLap[];
};

export type GameImportSummary = {
  lapCount: number;
  sessionCount: number;
  trackCount: number;
  vehicleCount: number;
};

export type ImportedBestLap = {
  track: string;
  vehicle: string;
  vehicleClass: string;
  bestLapMs: number;
  bestLap: string;
  latestRun: string;
  lapCount: number;
};

export type ImportedLapTrendPoint = {
  label: string;
  lapTimeMs: number;
  lapTime: string;
};

export const importedRacingLapsData = importedRacingData as ImportedRacingData;

export function formatImportedSnapshotTime(generatedAt: string | null) {
  if (!generatedAt) {
    return 'not generated';
  }

  const date = new Date(generatedAt);

  if (Number.isNaN(date.getTime())) {
    return 'invalid date';
  }

  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const year = kstDate.getUTCFullYear();
  const month = String(kstDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(kstDate.getUTCDate()).padStart(2, '0');
  const hours = String(kstDate.getUTCHours()).padStart(2, '0');
  const minutes = String(kstDate.getUTCMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes} KST`;
}

export function normalizeImportedLapTime(lapTimeMs: number) {
  const minutes = Math.floor(lapTimeMs / 60000);
  const seconds = Math.floor((lapTimeMs % 60000) / 1000);
  const milliseconds = lapTimeMs % 1000;

  return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds
    .toString()
    .padStart(3, '0')}`;
}

export function inferVehicleClass(vehicle: string) {
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

export function getImportedLapsByGame(laps: ImportedRacingLap[], gameId: RacingGameId) {
  return laps.filter((lap) => lap.gameId === gameId);
}

export function buildGameImportSummary(
  laps: ImportedRacingLap[],
  gameId: RacingGameId,
  sessionCount = 0
): GameImportSummary {
  const gameLaps = getImportedLapsByGame(laps, gameId);

  return {
    lapCount: gameLaps.length,
    sessionCount,
    trackCount: new Set(gameLaps.map((lap) => lap.track)).size,
    vehicleCount: new Set(gameLaps.map((lap) => lap.vehicle)).size
  };
}

export function getImportedTrackOptions(laps: ImportedRacingLap[], gameId: RacingGameId) {
  return [...new Set(getImportedLapsByGame(laps, gameId).map((lap) => lap.track))].sort((a, b) =>
    a.localeCompare(b)
  );
}

export function buildBestLapsByTrack(
  laps: ImportedRacingLap[],
  gameId: RacingGameId,
  selectedTrack: string | 'All'
): ImportedBestLap[] {
  const groups = new Map<string, ImportedRacingLap[]>();
  const filteredLaps = getImportedLapsByGame(laps, gameId).filter(
    (lap) => selectedTrack === 'All' || lap.track === selectedTrack
  );

  for (const lap of filteredLaps) {
    const key = `${lap.track}\u0000${lap.vehicle}\u0000${lap.vehicleClass}`;
    groups.set(key, [...(groups.get(key) ?? []), lap]);
  }

  return [...groups.values()]
    .map((group) => {
      const best = group.reduce((currentBest, lap) =>
        lap.lapTimeMs < currentBest.lapTimeMs ? lap : currentBest
      );
      const latest = group.reduce((currentLatest, lap) =>
        lap.recordedAt > currentLatest.recordedAt ? lap : currentLatest
      );

      return {
        track: best.track,
        vehicle: best.vehicle,
        vehicleClass: best.vehicleClass,
        bestLapMs: best.lapTimeMs,
        bestLap: normalizeImportedLapTime(best.lapTimeMs),
        latestRun: latest.recordedAt.slice(0, 10),
        lapCount: group.length
      };
    })
    .sort((a, b) => a.track.localeCompare(b.track) || a.bestLapMs - b.bestLapMs);
}

export function getSelectedTrackTrend(
  laps: ImportedRacingLap[],
  gameId: RacingGameId,
  selectedTrack: string | 'All'
): ImportedLapTrendPoint[] {
  return getImportedLapsByGame(laps, gameId)
    .filter((lap) => selectedTrack === 'All' || lap.track === selectedTrack)
    .sort((a, b) => a.recordedAt.localeCompare(b.recordedAt) || a.sourceId - b.sourceId)
    .map((lap, index) => ({
      label: `Lap ${index + 1}`,
      lapTimeMs: lap.lapTimeMs,
      lapTime: normalizeImportedLapTime(lap.lapTimeMs)
    }));
}
