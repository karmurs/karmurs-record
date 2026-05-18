import { describe, expect, it } from 'vitest';
import {
  buildBestLapsByTrack,
  buildGameImportSummary,
  formatImportedSnapshotTime,
  getImportedTrackOptions,
  getSelectedTrackTrend,
  inferVehicleClass,
  normalizeImportedLapTime
} from '../data/importedRacingLaps';
import type { ImportedRacingLap } from '../data/importedRacingLaps';

const sampleLaps: ImportedRacingLap[] = [
  {
    id: 'ace-1',
    gameId: 'ace',
    sourceId: 1,
    lapNumber: 1,
    lapTimeMs: 67130,
    sector1Ms: 0,
    sector2Ms: 0,
    sector3Ms: 0,
    weather: 'Unknown',
    vehicle: 'Hyundai i30 N Hatchback',
    vehicleClass: 'Road',
    track: 'Brands Hatch Indy',
    sessionType: 'Practice',
    sessionPhase: 'Practice',
    recordedAt: '2026-05-15T13:02:26.2331911+09:00',
    sourceName: 'EVO shared memory'
  },
  {
    id: 'ace-2',
    gameId: 'ace',
    sourceId: 2,
    lapNumber: 2,
    lapTimeMs: 57351,
    sector1Ms: 0,
    sector2Ms: 0,
    sector3Ms: 0,
    weather: 'Unknown',
    vehicle: 'Hyundai i30 N Hatchback',
    vehicleClass: 'Road',
    track: 'Brands Hatch Indy',
    sessionType: 'Practice',
    sessionPhase: 'Practice',
    recordedAt: '2026-05-15T13:03:23.5832006+09:00',
    sourceName: 'EVO shared memory'
  },
  {
    id: 'ace-3',
    gameId: 'ace',
    sourceId: 3,
    lapNumber: 1,
    lapTimeMs: 164292,
    sector1Ms: 0,
    sector2Ms: 0,
    sector3Ms: 0,
    weather: 'Unknown',
    vehicle: 'Volkswagen Golf 8 GTI Clubsport',
    vehicleClass: 'Touring',
    track: 'Nurburgring GP Strecke',
    sessionType: 'Practice',
    sessionPhase: 'Practice',
    recordedAt: '2026-05-16T00:50:32.9730255+09:00',
    sourceName: 'EVO shared memory'
  }
];

describe('imported racing laps', () => {
  it('formats imported snapshot times for display', () => {
    expect(formatImportedSnapshotTime('2026-05-18T04:02:10.293Z')).toBe('2026-05-18 13:02 KST');
    expect(formatImportedSnapshotTime(null)).toBe('not generated');
    expect(formatImportedSnapshotTime('not-a-date')).toBe('invalid date');
  });

  it('formats imported lap times', () => {
    expect(normalizeImportedLapTime(57351)).toBe('0:57.351');
    expect(normalizeImportedLapTime(164292)).toBe('2:44.292');
    expect(normalizeImportedLapTime(580990)).toBe('9:40.990');
  });

  it('infers useful vehicle classes from car names', () => {
    expect(inferVehicleClass('Ferrari 488 Challenge Evo')).toBe('Challenge');
    expect(inferVehicleClass('Volkswagen Golf 8 GTI Clubsport')).toBe('Touring');
    expect(inferVehicleClass('Hyundai i30 N Hatchback')).toBe('Road');
    expect(inferVehicleClass('Mystery Prototype')).toBe('Unknown');
  });

  it('builds game summaries and track filters', () => {
    expect(buildGameImportSummary(sampleLaps, 'ace')).toEqual({
      lapCount: 3,
      sessionCount: 0,
      trackCount: 2,
      vehicleCount: 2
    });
    expect(getImportedTrackOptions(sampleLaps, 'ace')).toEqual([
      'Brands Hatch Indy',
      'Nurburgring GP Strecke'
    ]);
  });

  it('builds best laps and trend for a selected track', () => {
    expect(buildBestLapsByTrack(sampleLaps, 'ace', 'Brands Hatch Indy')).toEqual([
      {
        track: 'Brands Hatch Indy',
        vehicle: 'Hyundai i30 N Hatchback',
        vehicleClass: 'Road',
        bestLapMs: 57351,
        bestLap: '0:57.351',
        latestRun: '2026-05-15',
        lapCount: 2
      }
    ]);

    expect(getSelectedTrackTrend(sampleLaps, 'ace', 'Brands Hatch Indy')).toEqual([
      { label: 'Lap 1', lapTimeMs: 67130, lapTime: '1:07.130' },
      { label: 'Lap 2', lapTimeMs: 57351, lapTime: '0:57.351' }
    ]);
  });
});
