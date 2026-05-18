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

export const publicRecordTypes = ['journal', 'gallery', 'racing', 'devlog'] as const;

export const records: RecordEntry[] = [
  {
    id: 'journal-hello-record',
    title: "Karmurs' Record를 여는 기준",
    type: 'journal',
    date: '2026-05-16',
    summary: '흘려보내기 아까운 글과 기억을 다시 꺼내기 쉬운 형태로 모아두기로 했다.',
    body: "Karmurs' Record는 완성된 블로그보다 개인 기록실에 가깝다. 짧은 생각, 오래 보고 싶은 문장, 나중에 다시 이어 쓸 메모를 공개해도 괜찮은 범위 안에서 차분히 쌓아간다.",
    tags: ['journal', 'record'],
    visibility: 'link',
    createdAt: '2026-05-16T06:00:00+09:00',
    updatedAt: '2026-05-16T06:00:00+09:00',
    imageTone: 'warm'
  },
  {
    id: 'gallery-first-mood',
    title: '첫 화면의 무드 보드',
    type: 'gallery',
    date: '2026-05-16',
    summary: '다크 에디토리얼 배경 위에 손글씨 문구와 큰 카드 입구를 올린 첫 방향.',
    body: '첫 화면은 설명보다 분위기로 기억되게 둔다. 검은 배경, 아이보리 톤, 따뜻한 브라운 포인트를 쓰고 Journal, Gallery, Racing, Devlog 카드가 각각 다른 기록실로 이어지게 만든다.',
    tags: ['gallery', 'mood', 'homepage'],
    visibility: 'link',
    createdAt: '2026-05-16T06:05:00+09:00',
    updatedAt: '2026-05-16T06:05:00+09:00',
    imageTone: 'mono'
  },
  {
    id: 'racing-first-card',
    title: 'Racing 기록장의 첫 구조',
    type: 'racing',
    date: '2026-05-16',
    summary: '랩타임, 세션, 트랙, 차량 메모를 한곳에서 훑어볼 수 있는 입구를 만들었다.',
    body: 'Racing은 개인 기록 중 별도의 축으로 남긴다. 현재 seed 기록은 구조를 보여주는 공개용 예시이며, 실제 랩타임이나 세션 데이터는 검증된 값만 나중에 교체해서 넣는다.',
    tags: ['racing', 'session', 'archive'],
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
    title: 'Devlog를 메인에 남긴 이유',
    type: 'devlog',
    date: '2026-05-16',
    summary: '이 홈페이지가 계속 만들어지는 프로젝트라는 사실도 기록의 일부로 남긴다.',
    body: 'Devlog는 임시 카드가 아니라 네 번째 메인 섹션이다. 디자인 조정, 배포 준비, 기능 아이디어, 개인 도구를 만들며 배운 점을 공개 가능한 범위에서 짧게 기록한다.',
    tags: ['devlog', 'homepage', 'decision'],
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
