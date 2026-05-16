export type RecordType =
  | 'journal'
  | 'gallery'
  | 'racing'
  | 'devlog'
  | 'archive'
  | 'project'
  | 'note';

export type RecordVisibility = 'link' | 'private';

export type RecordEntry = {
  id: string;
  title: string;
  type: RecordType;
  date: string;
  summary: string;
  body: string;
  tags: string[];
  visibility: RecordVisibility;
  createdAt: string;
  updatedAt: string;
  imageTone?: 'warm' | 'mono' | 'racing' | 'dev';
  lapTime?: string;
  racingTrack?: string;
  racingCar?: string;
};

export const primarySections = [
  {
    id: 'journal' as const,
    title: 'Journal',
    label: '생각, 일기, 짧은 문장',
    eyebrow: 'latest note'
  },
  {
    id: 'gallery' as const,
    title: 'Gallery',
    label: '사진, 캡처, 분위기 이미지',
    eyebrow: 'photo pieces'
  },
  {
    id: 'racing' as const,
    title: 'Racing',
    label: '랩타임, 세션, 트랙 메모',
    eyebrow: 'lap records'
  },
  {
    id: 'devlog' as const,
    title: 'Devlog',
    label: '개발일지, 수정 기록, 아이디어',
    eyebrow: 'build notes'
  }
];

export const records: RecordEntry[] = [
  {
    id: 'journal-hello-record',
    title: '사이트 이름을 정한 날',
    type: 'journal',
    date: '2026-05-16',
    summary: "Karmurs' Record라는 이름으로 개인 기록 공간을 시작했다.",
    body: '흘려보내기 아까운 것들을 모아두는 공간으로 시작한다. 일기, 사진, 링크, 파일, 레이싱 기록까지 필요할 때 다시 꺼내보기 쉽게 남긴다.',
    tags: ['site', 'journal'],
    visibility: 'link',
    createdAt: '2026-05-16T06:00:00+09:00',
    updatedAt: '2026-05-16T06:00:00+09:00',
    imageTone: 'warm'
  },
  {
    id: 'gallery-first-mood',
    title: '첫 무드 보드',
    type: 'gallery',
    date: '2026-05-16',
    summary: '다크 에디토리얼과 손글씨 타이틀을 섞은 첫 분위기.',
    body: '완전한 블로그보다 개인 전시장에 가까운 화면을 목표로 한다. 큰 검은 배경, 아이보리 카드, 따뜻한 브라운 포인트를 사용한다.',
    tags: ['gallery', 'mood'],
    visibility: 'link',
    createdAt: '2026-05-16T06:05:00+09:00',
    updatedAt: '2026-05-16T06:05:00+09:00',
    imageTone: 'mono'
  },
  {
    id: 'racing-first-card',
    title: 'Racing 섹션 자리 잡기',
    type: 'racing',
    date: '2026-05-16',
    summary: '첫 화면의 세 번째 카드를 Racing으로 고정했다.',
    body: '레이싱 기록은 개인 기록 중 중요한 축이다. 랩타임, 세션, 트랙 메모, 차량 메모를 저장하는 공간으로 확장한다.',
    tags: ['racing', 'lap'],
    visibility: 'link',
    createdAt: '2026-05-16T06:10:00+09:00',
    updatedAt: '2026-05-16T06:10:00+09:00',
    imageTone: 'racing',
    lapTime: '1:48.532',
    racingTrack: 'Example Circuit',
    racingCar: 'GT3'
  },
  {
    id: 'devlog-first-note',
    title: 'Devlog 카드 추가',
    type: 'devlog',
    date: '2026-05-16',
    summary: '홈 화면에 개발일지용 Devlog 카드를 추가했다.',
    body: '홈페이지가 단순한 기록장이 아니라 계속 만들어지는 프로젝트라는 점을 남기기 위해 Devlog 섹션을 추가한다. 앞으로 디자인 변경, 배포 기록, 기능 아이디어를 이곳에 쌓아간다.',
    tags: ['devlog', 'homepage'],
    visibility: 'link',
    createdAt: '2026-05-16T08:50:00+09:00',
    updatedAt: '2026-05-16T08:50:00+09:00',
    imageTone: 'dev'
  }
];

export function getRecordsByType(type: RecordType) {
  return records.filter((record) => record.type === type && record.visibility === 'link');
}

export function getPublicRecords() {
  return [...records]
    .filter((record) => record.visibility === 'link')
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
}

export function getRecordById(id: string) {
  return records.find((record) => record.id === id && record.visibility === 'link');
}
