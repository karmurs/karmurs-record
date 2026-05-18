export type RecordType =
  | 'journal'
  | 'gallery'
  | 'racing'
  | 'devlog'
  | 'archive'
  | 'project'
  | 'note';

export type RecordVisibility = 'link' | 'private';
export type RecordAdminVisibility = 'public' | 'private' | 'draft';

export type RecordEntry = {
  id: string;
  title: string;
  type: RecordType;
  date: string;
  summary: string;
  body: string;
  tags: string[];
  visibility: RecordVisibility;
  adminVisibility?: RecordAdminVisibility;
  createdAt: string;
  updatedAt: string;
  imageTone?: 'warm' | 'mono' | 'racing' | 'dev';
  coverImageUrl?: string;
  coverImageAlt?: string;
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

export const publicRecordTypes = ['journal', 'gallery', 'racing', 'devlog'] as const;

export const records: RecordEntry[] = [
  {
    id: 'journal-hello-record',
    title: '기록을 남기는 방식',
    type: 'journal',
    date: '2026-05-16',
    summary: '짧게 적고, 오래 남기고, 나중에 다시 꺼내기 쉬운 형태로 쌓아둔다.',
    body: '완성된 글만 모으기보다 지금의 생각을 너무 무겁지 않게 남긴다. 일기, 메모, 마음에 남은 문장처럼 다시 돌아볼 이유가 있는 것들을 공개해도 괜찮은 범위 안에서 천천히 정리한다.',
    tags: ['journal', 'note'],
    visibility: 'link',
    createdAt: '2026-05-16T06:00:00+09:00',
    updatedAt: '2026-05-16T06:00:00+09:00',
    imageTone: 'warm'
  },
  {
    id: 'gallery-first-mood',
    title: '남겨둔 장면들',
    type: 'gallery',
    date: '2026-05-16',
    summary: '사진, 캡처, 분위기처럼 말보다 먼저 떠오르는 조각들을 모아둔다.',
    body: '잘 찍은 사진만 올리는 공간은 아니다. 특정 날의 공기, 게임 속 장면, 작업 중 남은 화면처럼 나중에 다시 보면 바로 그때가 떠오르는 이미지를 차분히 보관한다.',
    tags: ['gallery', 'scene', 'archive'],
    visibility: 'link',
    createdAt: '2026-05-16T06:05:00+09:00',
    updatedAt: '2026-05-16T06:05:00+09:00',
    imageTone: 'mono'
  },
  {
    id: 'racing-first-card',
    title: '랩타임 노트',
    type: 'racing',
    date: '2026-05-16',
    summary: '트랙, 차량, 세션별 기록을 한곳에서 비교할 수 있게 정리한다.',
    body: 'ACC, ACE, LMU에서 남긴 랩타임과 세션 기록을 따로 흩어두지 않고 같은 흐름으로 본다. 빠른 기록뿐 아니라 어떤 차량과 조건에서 나온 기록인지까지 함께 남기는 쪽을 기준으로 삼는다.',
    tags: ['racing', 'lap-time', 'setup'],
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
    title: '업데이트 기록',
    type: 'devlog',
    date: '2026-05-16',
    summary: '홈페이지가 어떻게 바뀌고 있는지 공개해도 되는 범위에서 남긴다.',
    body: '기능을 붙이고, 디자인을 다듬고, 자동화를 정리한 과정을 하루 단위로 요약한다. 내부 설정이나 민감한 값은 제외하고, 나중에 봐도 흐름을 이해할 수 있는 업데이트 내역만 남긴다.',
    tags: ['devlog', 'update', 'homepage'],
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
