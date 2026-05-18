import { describe, expect, it } from 'vitest';
import {
  getTrackDisplayName,
  getCarDisplayName,
  racingCarCatalog,
  racingTrackCatalog
} from '../data/racingCatalog';

describe('racing catalog', () => {
  it('keeps track layouts as distinct selectable entries', () => {
    const uniqueTrackIds = new Set(
      racingTrackCatalog.map((track) => `${track.gameId}:${track.name}:${track.layout ?? 'Default'}`)
    );

    expect(uniqueTrackIds.size).toBe(racingTrackCatalog.length);
    expect(
      racingTrackCatalog.some(
        (track) => track.gameId === 'lmu' && track.name === 'Bahrain' && track.layout === 'Outer'
      )
    ).toBe(true);
    expect(
      racingTrackCatalog.some(
        (track) =>
          track.gameId === 'ace' &&
          track.name === 'Nurburgring Nordschleife' &&
          track.layout === 'Touristenfahrten'
      )
    ).toBe(true);
  });

  it('formats default and named layouts for setup dropdowns', () => {
    expect(
      getTrackDisplayName({
        gameId: 'acc',
        name: 'Spa-Francorchamps',
        layout: 'Default',
        source: 'test'
      })
    ).toBe('Spa-Francorchamps');

    expect(
      getTrackDisplayName({
        gameId: 'lmu',
        name: 'Bahrain',
        layout: 'Outer',
        source: 'test'
      })
    ).toBe('Bahrain - Outer');
  });

  it('stores cars as individual selectable models instead of broad grouped labels', () => {
    expect(racingCarCatalog.some((car) => car.gameId === 'acc' && car.name === 'R8 LMS GT2')).toBe(true);
    expect(racingCarCatalog.some((car) => car.gameId === 'acc' && car.name === 'GT2')).toBe(true);
    expect(racingCarCatalog.some((car) => car.gameId === 'ace' && car.name === 'SF-25 F1')).toBe(true);
    expect(racingCarCatalog.some((car) => car.gameId === 'lmu' && car.name === 'GMR-001')).toBe(true);
    expect(racingCarCatalog.some((car) => car.gameId === 'lmu' && car.name === '963')).toBe(true);
    expect(
      getCarDisplayName({
        gameId: 'acc',
        brand: 'Maserati',
        name: 'GT2',
        category: 'GT2',
        source: 'test'
      })
    ).toBe('Maserati GT2');
  });
});
