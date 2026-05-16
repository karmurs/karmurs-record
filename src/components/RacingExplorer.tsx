import { useMemo, useState } from 'react';
import {
  brandFallbacks,
  brandLogoPaths,
  racingCarCatalog,
  racingTrackCatalog
} from '../data/racingCatalog';
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
                  : gameSessions.length}
            </strong>
            <span>{selectedMenuId === 'tracks' ? 'tracks' : selectedMenuId === 'cars' ? 'cars' : 'saved sessions'}</span>
          </div>
        </header>

        {selectedMenuId === 'sessions' ? (
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
