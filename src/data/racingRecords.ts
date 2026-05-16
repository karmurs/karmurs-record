export type RacingGameId = 'acc' | 'ace' | 'lmu';

export type RacingMenuId = 'sessions' | 'setups' | 'lap-notes' | 'screenshots' | 'telemetry';

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
  sessionType: SessionType;
  bestLap: string;
  note: string;
};

const defaultMenus: RacingMenuItem[] = [
  { id: 'sessions', label: 'Sessions', count: 3 },
  { id: 'setups', label: 'Setups', count: 2 },
  { id: 'lap-notes', label: 'Lap Notes', count: 4 },
  { id: 'screenshots', label: 'Screenshots', count: 6 },
  { id: 'telemetry', label: 'Telemetry', count: 1 }
];

export const racingGames: RacingGame[] = [
  {
    id: 'acc',
    title: 'Assetto Corsa Competizione',
    shortTitle: 'ACC',
    accent: 'acc',
    menus: defaultMenus
  },
  {
    id: 'ace',
    title: 'Assetto Corsa EVO',
    shortTitle: 'ACE',
    accent: 'ace',
    menus: defaultMenus
  },
  {
    id: 'lmu',
    title: 'Le Mans Ultimate',
    shortTitle: 'LMU',
    accent: 'lmu',
    menus: defaultMenus
  }
];

export const racingSessions: RacingSession[] = [
  {
    id: 'acc-spa-practice',
    gameId: 'acc',
    date: '2026-05-16',
    track: 'Spa-Francorchamps',
    car: 'BMW M4 GT3',
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
    sessionType: 'Hotlap',
    bestLap: '1:30.188',
    note: '고속 섹터에서 ERS 사용 타이밍 비교.'
  }
];
