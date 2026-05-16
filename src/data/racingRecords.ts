import { getCatalogCounts } from './racingCatalog';

export type RacingGameId = 'acc' | 'ace' | 'lmu';

export type RacingMenuId =
  | 'sessions'
  | 'tracks'
  | 'cars'
  | 'setups'
  | 'lap-notes'
  | 'screenshots'
  | 'telemetry';

export type SessionType = 'Practice' | 'Qualifying' | 'Race' | 'Hotlap' | 'Test';

export type RacingMenuItem = {
  id: RacingMenuId;
  label: string;
  count: number;
};

export type RacingGame = {
  id: RacingGameId;
  title: string;
  shortTitle: string;
  accent: 'acc' | 'ace' | 'lmu';
  menus: RacingMenuItem[];
};

export type RacingSession = {
  id: string;
  gameId: RacingGameId;
  date: string;
  track: string;
  car: string;
  carBadge: string;
  trackImage?: string;
  carImage?: string;
  sessionType: SessionType;
  bestLap: string;
  note: string;
};

const createMenus = (gameId: RacingGameId): RacingMenuItem[] => {
  const counts = getCatalogCounts(gameId);

  return [
  { id: 'sessions', label: 'Sessions', count: 3 },
  { id: 'tracks', label: 'Tracks', count: counts.tracks },
  { id: 'cars', label: 'Cars', count: counts.cars },
  { id: 'setups', label: 'Setups', count: 2 },
  { id: 'lap-notes', label: 'Lap Notes', count: 4 },
  { id: 'screenshots', label: 'Screenshots', count: 6 },
  { id: 'telemetry', label: 'Telemetry', count: 1 }
  ];
};

export const racingGames: RacingGame[] = [
  {
    id: 'acc',
    title: 'Assetto Corsa Competizione',
    shortTitle: 'ACC',
    accent: 'acc',
    menus: createMenus('acc')
  },
  {
    id: 'ace',
    title: 'Assetto Corsa EVO',
    shortTitle: 'ACE',
    accent: 'ace',
    menus: createMenus('ace')
  },
  {
    id: 'lmu',
    title: 'Le Mans Ultimate',
    shortTitle: 'LMU',
    accent: 'lmu',
    menus: createMenus('lmu')
  }
];

export const racingSessions: RacingSession[] = [
  {
    id: 'acc-spa-practice',
    gameId: 'acc',
    date: '2026-05-16',
    track: 'Spa-Francorchamps',
    car: 'BMW M4 GT3',
    carBadge: 'BMW',
    trackImage: 'racing/tracks/spa-francorchamps.jpg',
    carImage: 'racing/cars/bmw-m4-gt3.jpg',
    sessionType: 'Practice',
    bestLap: '2:19.842',
    note: '브레이킹 포인트와 섹터 2 리듬 확인.'
  },
  {
    id: 'acc-monza-qualifying',
    gameId: 'acc',
    date: '2026-05-15',
    track: 'Monza',
    car: 'Ferrari 296 GT3',
    carBadge: 'Ferrari',
    trackImage: 'racing/tracks/monza.jpg',
    carImage: 'racing/cars/ferrari-296-gt3.jpg',
    sessionType: 'Qualifying',
    bestLap: '1:47.921',
    note: '어센션 탈출에서 트랙션 손실이 큼.'
  },
  {
    id: 'acc-nurburgring-race',
    gameId: 'acc',
    date: '2026-05-14',
    track: 'Nurburgring',
    car: 'Porsche 992 GT3 R',
    carBadge: 'Porsche',
    trackImage: 'racing/tracks/nurburgring.jpg',
    carImage: 'racing/cars/porsche-992-gt3.jpg',
    sessionType: 'Race',
    bestLap: '1:55.302',
    note: '연료 무게 변화에 따른 언더스티어 기록.'
  },
  {
    id: 'ace-imola-test',
    gameId: 'ace',
    date: '2026-05-13',
    track: 'Imola',
    car: 'Alfa Romeo Giulia GTAm',
    carBadge: 'Alfa Romeo',
    trackImage: 'racing/tracks/imola.jpg',
    carImage: 'racing/cars/alfa-romeo-giulia-gtam.jpg',
    sessionType: 'Test',
    bestLap: '1:58.440',
    note: 'FFB 연결감과 중속 코너 회두감 메모.'
  },
  {
    id: 'lmu-fuji-hotlap',
    gameId: 'lmu',
    date: '2026-05-12',
    track: 'Fuji Speedway',
    car: 'Ferrari 499P',
    carBadge: 'Ferrari',
    trackImage: 'racing/tracks/fuji-speedway.jpg',
    carImage: 'racing/cars/ferrari-499p.jpg',
    sessionType: 'Hotlap',
    bestLap: '1:30.188',
    note: '고속 섹터에서 ERS 사용 타이밍 비교.'
  }
];
