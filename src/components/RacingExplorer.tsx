import { useMemo, useState } from 'react';
import {
  brandFallbacks,
  brandLogoPaths,
  racingCarCatalog,
  racingTrackCatalog
} from '../data/racingCatalog';
import {
  buildBestLapsByTrack,
  buildGameImportSummary,
  formatImportedSnapshotTime,
  getImportedLapsByGame,
  getImportedTrackOptions,
  getSelectedTrackTrend,
  importedRacingLapsData
} from '../data/importedRacingLaps';
import {
  racingGames,
  racingSessions,
  type RacingGameId,
  type RacingMenuId,
  type SessionType
} from '../data/racingRecords';

const sessionTypeLabels: SessionType[] = ['Practice', 'Qualifying', 'Race', 'Hotlap', 'Test'];

const getBrandClass = (brand: string) => brand.toLowerCase().replace(/\s+/g, '-');
const getTrackClass = (track: string) => track.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const trackPaths: Record<string, string> = {
  'spa-francorchamps': 'M10 32 C18 14 35 10 47 18 C58 26 45 35 33 38 C22 41 14 40 10 32 Z',
  monza: 'M15 31 C19 18 43 14 52 22 C62 31 42 38 27 38 C16 38 10 35 15 31 Z',
  nurburgring: 'M10 34 C18 22 18 12 30 14 C42 16 39 27 52 25 C61 24 57 39 43 41 C29 43 18 41 10 34 Z',
  imola: 'M14 36 C25 18 42 13 51 22 C58 29 52 37 40 36 C29 35 24 43 14 36 Z',
  'fuji-speedway': 'M8 34 C15 22 33 18 50 18 C60 18 58 31 47 34 C33 38 18 43 8 34 Z'
};

const fallbackTrackPaths = [
  'M11 31 C15 18 32 12 46 18 C58 23 55 38 40 40 C25 42 12 39 11 31 Z',
  'M9 34 C20 20 33 17 50 21 C60 24 58 35 45 36 C30 38 22 45 9 34 Z',
  'M13 36 C19 18 42 12 52 23 C61 34 42 38 30 34 C21 31 18 43 13 36 Z',
  'M9 29 C17 16 31 17 38 24 C45 31 57 23 58 32 C59 42 40 43 26 39 C15 36 5 37 9 29 Z',
  'M14 34 C16 24 26 15 36 16 C50 17 57 25 51 34 C45 43 26 41 14 34 Z',
  'M10 35 C16 21 29 21 37 15 C49 6 60 22 52 31 C44 41 21 45 10 35 Z'
];

const getTrackPath = (track: string) => {
  const key = getTrackClass(track);
  if (trackPaths[key]) {
    return trackPaths[key];
  }

  const index = [...key].reduce((sum, char) => sum + char.charCodeAt(0), 0) % fallbackTrackPaths.length;
  return fallbackTrackPaths[index];
};

export default function RacingExplorer() {
  const [selectedGameId, setSelectedGameId] = useState<RacingGameId>('acc');
  const [selectedMenuId, setSelectedMenuId] = useState<RacingMenuId>('sessions');
  const [selectedSessionType, setSelectedSessionType] = useState<'All' | SessionType>('All');
  const [selectedImportedTrack, setSelectedImportedTrack] = useState<'All' | string>('All');

  const selectedGame = racingGames.find((game) => game.id === selectedGameId) ?? racingGames[0];
  const gameSessions = racingSessions.filter((session) => session.gameId === selectedGame.id);
  const visibleSessions = useMemo(
    () =>
      gameSessions.filter(
        (session) => selectedSessionType === 'All' || session.sessionType === selectedSessionType
      ),
    [gameSessions, selectedSessionType]
  );
  const selectedMenu = selectedGame.menus.find((menu) => menu.id === selectedMenuId);
  const previewSession = visibleSessions[0];
  const catalogTracks = racingTrackCatalog.filter((track) => track.gameId === selectedGame.id);
  const catalogCars = racingCarCatalog.filter((car) => car.gameId === selectedGame.id);
  const importedSource = importedRacingLapsData.sources[selectedGame.id];
  const importedSnapshotTime = formatImportedSnapshotTime(importedRacingLapsData.generatedAt);
  const importedSourceStatuses = racingGames.map((game) => ({
    game,
    source: importedRacingLapsData.sources[game.id]
  }));
  const importedGameLaps = getImportedLapsByGame(importedRacingLapsData.laps, selectedGame.id);
  const importedTrackOptions = getImportedTrackOptions(importedRacingLapsData.laps, selectedGame.id);
  const importedSummary = buildGameImportSummary(
    importedRacingLapsData.laps,
    selectedGame.id,
    importedSource?.sessionCount ?? 0
  );
  const importedBestLaps = buildBestLapsByTrack(
    importedRacingLapsData.laps,
    selectedGame.id,
    selectedImportedTrack
  );
  const importedTrend = getSelectedTrackTrend(
    importedRacingLapsData.laps,
    selectedGame.id,
    selectedImportedTrack
  );
  const visibleTrend = importedTrend.slice(-12);
  const hasImportedLaps = importedGameLaps.length > 0;
  const bestChartLaps = importedBestLaps.slice(0, 6);
  const fastestBestLap = Math.min(...bestChartLaps.map((lap) => lap.bestLapMs));
  const slowestBestLap = Math.max(...bestChartLaps.map((lap) => lap.bestLapMs));
  const trendFastestLap = Math.min(...visibleTrend.map((lap) => lap.lapTimeMs));
  const trendSlowestLap = Math.max(...visibleTrend.map((lap) => lap.lapTimeMs));
  const trendPoints = visibleTrend
    .map((lap, index) => {
      const x = visibleTrend.length === 1 ? 50 : (index / (visibleTrend.length - 1)) * 100;
      const y =
        trendFastestLap === trendSlowestLap
          ? 50
          : 14 + ((lap.lapTimeMs - trendFastestLap) / (trendSlowestLap - trendFastestLap)) * 72;

      return `${x},${y}`;
    })
    .join(' ');

  return (
    <section className="racing-explorer" aria-label="Racing records explorer">
      <aside className="racing-sidebar" aria-label="Racing games and folders">
        <div className="racing-sidebar-title">
          <span>Records</span>
          <small>Racing archive</small>
        </div>

        <div className="racing-tree">
          {racingGames.map((game) => (
            <div className="racing-tree-group" key={game.id}>
              <button
                aria-pressed={selectedGame.id === game.id}
                className={`racing-game-button racing-accent-${game.accent}`}
                onClick={() => {
                  setSelectedGameId(game.id);
                  setSelectedMenuId('sessions');
                  setSelectedSessionType('All');
                  setSelectedImportedTrack('All');
                }}
                type="button"
              >
                <span className="folder-dot" />
                <span>{game.title}</span>
              </button>
              <div className="racing-menu-list">
                {game.menus.map((menu) => (
                  <button
                    aria-pressed={selectedGame.id === game.id && selectedMenuId === menu.id}
                    className="racing-menu-button"
                    key={`${game.id}-${menu.id}`}
                    onClick={() => {
                      setSelectedGameId(game.id);
                      setSelectedMenuId(menu.id);
                      setSelectedImportedTrack('All');
                    }}
                    type="button"
                  >
                    <span>{menu.label}</span>
                    <small>{menu.count}</small>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <div className="racing-content">
        <div className={`racing-visual-band racing-accent-${selectedGame.accent}`}>
          <div className="track-preview" aria-label={`${selectedGame.shortTitle} track preview`}>
            {previewSession?.trackImage ? (
              <img alt={`${previewSession.track} track`} src={previewSession.trackImage} />
            ) : (
              <span className="track-line" />
            )}
            {previewSession ? (
              <span className="media-label">
                <small>Track photo</small>
                {previewSession.track}
              </span>
            ) : null}
            <strong>{selectedGame.shortTitle}</strong>
          </div>
          <div className="car-preview" aria-label={`${selectedGame.shortTitle} car preview`}>
            {previewSession?.carImage ? (
              <>
                <img className="car-preview-image" alt={`${previewSession.car} car`} src={previewSession.carImage} />
                <span className="media-label">
                  <small>Car photo</small>
                  {previewSession.car}
                </span>
                <span className="car-badge">{previewSession.carBadge}</span>
              </>
            ) : (
              <>
                <span className="car-body" />
                <span className="car-shadow" />
              </>
            )}
          </div>
        </div>

        <header className="racing-content-header">
          <div>
            <p className="hero-kicker">{selectedGame.shortTitle} records</p>
            <h2>{selectedGame.title}</h2>
            <p>{selectedMenu?.label ?? 'Sessions'} 기록을 세션 타입, 트랙, 차량 기준으로 훑어보는 공간.</p>
          </div>
          <div className="racing-stat">
            <strong>
              {selectedMenuId === 'tracks'
                ? catalogTracks.length
                : selectedMenuId === 'cars'
                  ? catalogCars.length
                  : hasImportedLaps
                    ? importedSummary.lapCount
                    : gameSessions.length}
            </strong>
            <span>
              {selectedMenuId === 'tracks'
                ? 'tracks'
                : selectedMenuId === 'cars'
                  ? 'cars'
                  : hasImportedLaps
                    ? 'imported laps'
                    : 'saved sessions'}
            </span>
          </div>
        </header>

        {selectedMenuId === 'sessions' ? (
          <>
            <section
              aria-label={`${selectedGame.title} imported racing records`}
              className="imported-racing-panel"
            >
              <div className="imported-racing-heading">
                <div>
                  <p className="hero-kicker">Imported DeltaLine laps</p>
                  <h3>Game DB sync</h3>
                  <p className="imported-sync-time">Last sync {importedSnapshotTime}</p>
                </div>
                <span className={`import-status import-status-${importedSource?.status ?? 'missing'}`}>
                  {importedSource?.status ?? 'missing'}
                </span>
              </div>

              <div className="imported-source-statuses" aria-label="Racing import source statuses">
                {importedSourceStatuses.map(({ game, source }) => (
                  <span
                    className={`import-source-pill import-status-${source?.status ?? 'missing'}`}
                    key={game.id}
                  >
                    {game.shortTitle}: {source?.status ?? 'missing'}
                  </span>
                ))}
              </div>

              <div className="imported-summary-grid" aria-label="Imported racing summary">
                <div className="imported-summary-card">
                  <strong>{importedSummary.lapCount}</strong>
                  <span>laps</span>
                </div>
                <div className="imported-summary-card">
                  <strong>{importedSummary.sessionCount}</strong>
                  <span>sessions</span>
                </div>
                <div className="imported-summary-card">
                  <strong>{importedSummary.trackCount}</strong>
                  <span>tracks</span>
                </div>
                <div className="imported-summary-card">
                  <strong>{importedSummary.vehicleCount}</strong>
                  <span>vehicles</span>
                </div>
              </div>

              {hasImportedLaps ? (
                <>
                  <div className="imported-track-filters" aria-label="Imported track filters" role="group">
                    <button
                      aria-pressed={selectedImportedTrack === 'All'}
                      className="session-chip"
                      onClick={() => setSelectedImportedTrack('All')}
                      type="button"
                    >
                      All courses
                    </button>
                    {importedTrackOptions.map((track) => (
                      <button
                        aria-pressed={selectedImportedTrack === track}
                        className="session-chip"
                        key={track}
                        onClick={() => setSelectedImportedTrack(track)}
                        type="button"
                      >
                        {track}
                      </button>
                    ))}
                  </div>

                  <div className="imported-chart-grid">
                    <div className="imported-chart-card">
                      <div className="imported-chart-title">
                        <strong>Best lap by course</strong>
                        <span>{selectedImportedTrack === 'All' ? 'All courses' : selectedImportedTrack}</span>
                      </div>
                      <div className="imported-bar-chart" aria-label="Track best lap chart" role="img">
                        {bestChartLaps.map((lap) => {
                          const height =
                            fastestBestLap === slowestBestLap
                              ? 72
                              : 34 + ((slowestBestLap - lap.bestLapMs) / (slowestBestLap - fastestBestLap)) * 56;

                          return (
                            <div className="imported-bar-column" key={`${lap.track}-${lap.vehicle}`}>
                              <span className="imported-bar-value">{lap.bestLap}</span>
                              <span className="imported-bar" style={{ height: `${height}%` }} />
                              <small>{lap.track}</small>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="imported-chart-card">
                      <div className="imported-chart-title">
                        <strong>Selected track trend</strong>
                        <span>{visibleTrend.length} laps</span>
                      </div>
                      <svg
                        aria-label="Selected track lap time trend"
                        className="imported-trend-chart"
                        role="img"
                        viewBox="0 0 100 100"
                      >
                        <polyline points={trendPoints} />
                      </svg>
                      <div className="imported-trend-scale">
                        <span>{visibleTrend[0]?.lapTime}</span>
                        <span>{visibleTrend[visibleTrend.length - 1]?.lapTime}</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="imported-best-table"
                    role="table"
                    aria-label={`${selectedGame.title} imported best laps`}
                  >
                    <div className="imported-best-row imported-best-row-head" role="row">
                      <span>Course</span>
                      <span>Vehicle</span>
                      <span>Class</span>
                      <span>Best Lap</span>
                      <span>Laps</span>
                    </div>
                    {importedBestLaps.map((lap) => (
                      <div className="imported-best-row" role="row" key={`${lap.track}-${lap.vehicle}`}>
                        <strong>{lap.track}</strong>
                        <span>{lap.vehicle}</span>
                        <span>{lap.vehicleClass}</span>
                        <span>{lap.bestLap}</span>
                        <span>{lap.lapCount}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="imported-empty-state">
                  아직 {selectedGame.shortTitle} DB에서 가져온 랩타임이 없습니다. 새 랩이 기록되면 import 명령으로 이 영역에 올라옵니다.
                </p>
              )}
            </section>

            <div className="session-toolbar" aria-label="Session type filters" role="group">
              {(['All', ...sessionTypeLabels] as const).map((type) => (
                <button
                  aria-pressed={selectedSessionType === type}
                  className={`session-chip session-${type.toLowerCase()}`}
                  key={type}
                  onClick={() => setSelectedSessionType(type)}
                  type="button"
                >
                  {type}
                </button>
              ))}
            </div>
          </>
        ) : null}

        {selectedMenuId === 'tracks' ? (
          <div className="catalog-grid" role="list" aria-label={`${selectedGame.title} implemented tracks`}>
            {catalogTracks.map((track) => (
              <div className="catalog-row" role="listitem" key={`${track.gameId}-${track.name}`}>
                <span
                  aria-label={`${track.name} layout`}
                  className={`track-layout-mini racing-accent-${selectedGame.accent} track-${getTrackClass(track.name)}`}
                  role="img"
                >
                  <svg aria-hidden="true" viewBox="0 0 64 52">
                    <path d={getTrackPath(track.name)} />
                  </svg>
                </span>
                <div>
                  <strong>{track.name}</strong>
                  <span>{track.layouts ?? track.source}</span>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {selectedMenuId === 'cars' ? (
          <div className="catalog-grid catalog-grid-cars" role="list" aria-label={`${selectedGame.title} implemented cars`}>
            {catalogCars.map((car) => (
              <div className="catalog-row" role="listitem" key={`${car.gameId}-${car.brand}-${car.name}`}>
                <span
                  aria-label={`${car.brand} badge`}
                  className={`brand-mark brand-${getBrandClass(car.brand)}`}
                  role="img"
                >
                  {brandLogoPaths[car.brand] ? (
                    <img alt="" aria-hidden="true" src={brandLogoPaths[car.brand]} />
                  ) : (
                    brandFallbacks[car.brand] ?? car.brand.slice(0, 2)
                  )}
                </span>
                <div>
                  <strong>{car.name}</strong>
                  <span>{car.brand} · {car.category}</span>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {selectedMenuId === 'sessions' ? (
          <div className="session-table" role="table" aria-label={`${selectedGame.title} sessions`}>
          <div className="session-row session-row-head" role="row">
            <span>Date</span>
            <span>Track</span>
            <span>Car</span>
            <span>Type</span>
            <span>Best Lap</span>
            <span>Note</span>
          </div>
          {visibleSessions.map((session) => (
            <div className="session-row" role="row" key={session.id}>
              <span>{session.date}</span>
              <strong className="session-media-cell">
                <span
                  aria-label={`${session.track} layout`}
                  className={`track-layout-mini racing-accent-${selectedGame.accent} track-${getTrackClass(session.track)}`}
                  role="img"
                >
                  <svg aria-hidden="true" viewBox="0 0 64 52">
                    <path d={getTrackPath(session.track)} />
                  </svg>
                </span>
                <span>{session.track}</span>
              </strong>
              <span className="session-media-cell">
                <span
                  aria-label={`${session.carBadge} badge`}
                  className={`brand-mark brand-${getBrandClass(session.carBadge)}`}
                  role="img"
                >
                  {brandLogoPaths[session.carBadge] ? (
                    <img alt="" aria-hidden="true" src={brandLogoPaths[session.carBadge]} />
                  ) : (
                    brandFallbacks[session.carBadge] ?? session.carBadge
                  )}
                </span>
                <span>{session.car}</span>
              </span>
              <span className={`session-type session-${session.sessionType.toLowerCase()}`}>
                {session.sessionType}
              </span>
              <span>{session.bestLap}</span>
              <span>{session.note}</span>
            </div>
          ))}
        </div>
        ) : null}
      </div>
    </section>
  );
}
