export type TuningDirection = 'up' | 'down';

export type TuningAdjustment = {
  parameter: string;
  direction: TuningDirection;
  detail: string;
  priority: 'primary' | 'secondary';
};

export type TuningSymptom = {
  id: string;
  icon: string;
  label: string;
  description: string;
  adjustments: TuningAdjustment[];
};

export const setupSelectionSteps = [
  {
    label: 'Step 1',
    title: '세션 목적',
    description: '예선은 Q 계열, 레이스는 R 또는 RS 계열, 안정 연습은 BASE 또는 SAFE를 먼저 봅니다.'
  },
  {
    label: 'Step 2',
    title: '트랙 조건',
    description: '온도 표기가 있는 셋업은 현재 트랙 온도와 가까운 쪽을 우선합니다.'
  },
  {
    label: 'Step 3',
    title: '연료량',
    description: '스틴트 길이가 길면 레이스 셋업과 연료 범위가 맞는 파일을 고릅니다.'
  },
  {
    label: 'Step 4',
    title: '주행 피드백',
    description: '랩을 돈 뒤 언더/오버/브레이킹/트랙션 증상별로 한두 항목만 조정합니다.'
  }
];

export const tuningSymptoms: TuningSymptom[] = [
  {
    id: 'us_entry',
    icon: '🔻',
    label: '코너 진입 언더스티어',
    description: '브레이킹 후 코너 들어갈 때 앞이 안 돌아감',
    adjustments: [
      { parameter: '앞 ARB', direction: 'down', detail: '앞 안티롤바 부드럽게 → 앞 그립 ↑', priority: 'primary' },
      { parameter: '뒤 ARB', direction: 'up', detail: '뒤 안티롤바 단단하게 → 상대적으로 앞 그립 ↑', priority: 'primary' },
      { parameter: '브레이크 바이어스', direction: 'down', detail: '앞쪽으로 이동 (Brake Bias %를 살짝 줄임)', priority: 'primary' },
      { parameter: '앞 타이어 압력', direction: 'down', detail: '앞 압력 -1~2 → 접지면 증가', priority: 'secondary' },
      { parameter: '캐스터', direction: 'up', detail: '캐스터 +1~2 → 코너 캠버 증가, 셀프 얼라인', priority: 'secondary' },
      { parameter: '앞 윙/스플리터', direction: 'up', detail: '앞 다운포스 ↑ (다운포스 차종만)', priority: 'secondary' }
    ]
  },
  {
    id: 'us_mid',
    icon: '🟡',
    label: '중간 코너 언더스티어',
    description: '정점 근처에서 앞이 미끄러지는 느낌',
    adjustments: [
      { parameter: '앞 ARB', direction: 'down', detail: '앞 ARB 부드럽게 → 가중 이동 활용', priority: 'primary' },
      { parameter: '뒤 ARB', direction: 'up', detail: '뒤 ARB 단단하게', priority: 'primary' },
      { parameter: '앞 캠버', direction: 'up', detail: '앞 정적 캠버 더 negative (-0.2~0.5)', priority: 'secondary' },
      { parameter: '앞 토우', direction: 'down', detail: 'toe-out 약간 늘림 (-0.05~0.1)', priority: 'secondary' },
      { parameter: '뒤 윙', direction: 'down', detail: '뒤 다운포스 줄여 밸런스 앞쪽으로', priority: 'secondary' }
    ]
  },
  {
    id: 'os_entry',
    icon: '🔺',
    label: '코너 진입 오버스티어',
    description: '브레이킹/턴인 시 뒤가 빠짐',
    adjustments: [
      { parameter: '브레이크 바이어스', direction: 'up', detail: '뒤쪽으로 살짝 이동 (BB% 올림)', priority: 'primary' },
      { parameter: '뒤 ARB', direction: 'down', detail: '뒤 안티롤바 부드럽게 → 뒤 그립 ↑', priority: 'primary' },
      { parameter: '앞 ARB', direction: 'up', detail: '앞 ARB 단단하게', priority: 'primary' },
      { parameter: '뒤 댐퍼 슬로우 범프', direction: 'up', detail: '뒤 가중 이동 진정', priority: 'secondary' },
      { parameter: '뒤 타이어 압력', direction: 'down', detail: '뒤 압력 -1 → 접지면 ↑', priority: 'secondary' }
    ]
  },
  {
    id: 'os_exit',
    icon: '⚡',
    label: '코너 탈출 시 오버스티어',
    description: '스로틀 밟을 때 뒤가 흘러나감 (트랙션 부족)',
    adjustments: [
      { parameter: 'TC1', direction: 'up', detail: 'TC1 단계 +1~2 (트랙션 컨트롤)', priority: 'primary' },
      { parameter: 'Preload', direction: 'down', detail: '디퍼렌셜 preload 줄임 (-20Nm)', priority: 'primary' },
      { parameter: '뒤 ARB', direction: 'down', detail: '뒤 ARB 부드럽게', priority: 'primary' },
      { parameter: '뒤 타이어 압력', direction: 'down', detail: '뒤 압력 약간 ↓', priority: 'secondary' },
      { parameter: '뒤 윙', direction: 'up', detail: '뒤 다운포스 늘려 안정성 ↑', priority: 'secondary' },
      { parameter: '뒤 캠버', direction: 'up', detail: '뒤 캠버 더 negative (큰 슬립 시)', priority: 'secondary' }
    ]
  },
  {
    id: 'os_late',
    icon: '🌀',
    label: '연료 줄어든 후반 오버스티어',
    description: '레이스 후반부 차가 가벼워지며 뒤가 불안',
    adjustments: [
      { parameter: 'Preload', direction: 'down', detail: 'preload 줄임 (-10~20Nm)', priority: 'primary' },
      { parameter: '뒤 ride height', direction: 'up', detail: '뒤 차고 +1~2 → 후방 안정', priority: 'primary' },
      { parameter: 'TC1', direction: 'up', detail: 'TC 한 단계 올려 후반 보험', priority: 'secondary' },
      { parameter: '연료 전략', direction: 'up', detail: '다음 레이스부터 연료 +2~3L 여유', priority: 'secondary' }
    ]
  },
  {
    id: 'brake_lock',
    icon: '🛑',
    label: '브레이킹 시 락업/불안정',
    description: '급제동 시 휠 락 또는 차가 흔들림',
    adjustments: [
      { parameter: 'ABS', direction: 'up', detail: 'ABS 단계 +1', priority: 'primary' },
      { parameter: '브레이크 바이어스', direction: 'down', detail: '앞쪽으로 살짝 (락이 뒤에서 나면)', priority: 'primary' },
      { parameter: '앞 댐퍼 슬로우 범프', direction: 'up', detail: '앞 슬로우 범프 단단하게 → 다이브 억제', priority: 'secondary' },
      { parameter: 'Brake Torque', direction: 'down', detail: '브레이크 토크 약간 ↓', priority: 'secondary' },
      { parameter: '앞 타이어 압력', direction: 'up', detail: '앞 압력 +1 (찌그러짐 줄임)', priority: 'secondary' }
    ]
  },
  {
    id: 'unstable_straight',
    icon: '💨',
    label: '고속 직선 불안정',
    description: '장직선에서 차가 좌우로 흔들리거나 뜨는 느낌',
    adjustments: [
      { parameter: '뒤 ride height', direction: 'up', detail: '뒤 차고 +1~2 → 후방 안정', priority: 'primary' },
      { parameter: '뒤 윙', direction: 'up', detail: '뒤 다운포스 +1~2', priority: 'primary' },
      { parameter: 'Toe', direction: 'up', detail: '앞 toe-in 살짝 (직진 안정성 ↑)', priority: 'secondary' },
      { parameter: '댐퍼 fast rebound', direction: 'up', detail: '패스트 리바운드 단단하게', priority: 'secondary' }
    ]
  },
  {
    id: 'kerb_unstable',
    icon: '🚧',
    label: '커브/연석 타고 불안정',
    description: '커브 위에서 차가 튀거나 균형이 깨짐',
    adjustments: [
      { parameter: 'Bumpstop Window', direction: 'up', detail: '범프스톱 윈도우 늘림 (+2~4)', priority: 'primary' },
      { parameter: '댐퍼 Fast Bump', direction: 'down', detail: '패스트 범프 부드럽게', priority: 'primary' },
      { parameter: '댐퍼 Fast Rebound', direction: 'down', detail: '패스트 리바운드 부드럽게', priority: 'primary' },
      { parameter: 'Bumpstop Rate', direction: 'down', detail: '범프스톱 레이트 약간 ↓', priority: 'secondary' }
    ]
  },
  {
    id: 'curb_jump',
    icon: '🦘',
    label: '코너 정점 후 접지 깨짐',
    description: '정점 지나며 휠이 떨어진 듯 그립 사라짐',
    adjustments: [
      { parameter: 'Wheel Rate', direction: 'down', detail: '휠 레이트(스프링) 부드럽게', priority: 'primary' },
      { parameter: '댐퍼 Slow Rebound', direction: 'down', detail: '슬로우 리바운드 부드럽게', priority: 'primary' },
      { parameter: 'ride height', direction: 'up', detail: '차고 약간 ↑ (서스 가용 행정 확보)', priority: 'secondary' }
    ]
  },
  {
    id: 'tire_wear_f',
    icon: '🛞',
    label: '앞 타이어 빨리 마모/과열',
    description: '레이스 중반에 앞 타이어 온도 100°C+ 또는 마모 심함',
    adjustments: [
      { parameter: '앞 캠버', direction: 'up', detail: '앞 캠버 더 negative (-0.3~0.5)', priority: 'primary' },
      { parameter: '앞 타이어 압력', direction: 'down', detail: '앞 압력 -1~2 (목표 26.5~28psi 핫)', priority: 'primary' },
      { parameter: '앞 토우', direction: 'down', detail: 'toe-out 줄여 마모 ↓', priority: 'secondary' },
      { parameter: '앞 브레이크 덕트', direction: 'up', detail: '브레이크 덕트 +1 (열 발산)', priority: 'secondary' }
    ]
  },
  {
    id: 'tire_wear_r',
    icon: '🔥',
    label: '뒤 타이어 빨리 마모/과열',
    description: '뒤 타이어 슬립 많아 마모/온도 급증',
    adjustments: [
      { parameter: 'TC1', direction: 'up', detail: 'TC 올려 스핀 ↓', priority: 'primary' },
      { parameter: '뒤 캠버', direction: 'up', detail: '뒤 캠버 더 negative', priority: 'primary' },
      { parameter: '뒤 타이어 압력', direction: 'down', detail: '뒤 압력 조정 (핫 26.5~28psi)', priority: 'primary' },
      { parameter: 'Preload', direction: 'down', detail: 'preload 줄여 부드러운 트랙션', priority: 'secondary' },
      { parameter: '뒤 브레이크 덕트', direction: 'up', detail: '뒤 브레이크 덕트 +1', priority: 'secondary' }
    ]
  },
  {
    id: 'tire_inner',
    icon: '↙️',
    label: '타이어 안쪽만 마모',
    description: '캠버 너무 negative한 신호',
    adjustments: [
      { parameter: '정적 캠버', direction: 'down', detail: '캠버 덜 negative (+0.2~0.4)', priority: 'primary' },
      { parameter: '타이어 압력', direction: 'up', detail: '압력 +1 (접지 패턴 균일화)', priority: 'secondary' }
    ]
  },
  {
    id: 'tire_outer',
    icon: '↘️',
    label: '타이어 바깥쪽만 마모',
    description: '캠버 부족 / 압력 부족 신호',
    adjustments: [
      { parameter: '정적 캠버', direction: 'up', detail: '캠버 더 negative (-0.2~0.4)', priority: 'primary' },
      { parameter: '타이어 압력', direction: 'up', detail: '압력 +1~2', priority: 'primary' }
    ]
  },
  {
    id: 'low_speed_slow',
    icon: '🐢',
    label: '저속 코너 답답함',
    description: '헤어핀이나 시케인에서 너무 무거움',
    adjustments: [
      { parameter: 'Steer Ratio', direction: 'down', detail: '스티어 비율 줄임 (반응 ↑)', priority: 'primary' },
      { parameter: 'Preload', direction: 'down', detail: 'preload 줄임 (저속 회전 ↑)', priority: 'primary' },
      { parameter: '앞 ARB', direction: 'down', detail: '앞 ARB 더 부드럽게', priority: 'secondary' }
    ]
  },
  {
    id: 'high_speed_unstable',
    icon: '🏆',
    label: '고속 코너 불안정',
    description: '에오 루즈, 130R 같은 고속에서 흔들림',
    adjustments: [
      { parameter: '뒤 윙', direction: 'up', detail: '뒤 윙 +1~2 (다운포스)', priority: 'primary' },
      { parameter: '차고', direction: 'down', detail: '전후 차고 -1 (지면 효과 ↑)', priority: 'primary' },
      { parameter: 'Wheel Rate', direction: 'up', detail: '스프링 단단하게', priority: 'secondary' },
      { parameter: '댐퍼 Fast', direction: 'up', detail: '패스트 범프/리바운드 단단하게', priority: 'secondary' }
    ]
  },
  {
    id: 'soft_floaty',
    icon: '🧳',
    label: '차가 너무 물렁/출렁임',
    description: '바운싱, 롤이 과도하게 느껴짐',
    adjustments: [
      { parameter: 'Wheel Rate', direction: 'up', detail: '스프링 +1~2', priority: 'primary' },
      { parameter: '댐퍼 Slow Bump', direction: 'up', detail: '슬로우 범프 단단하게', priority: 'primary' },
      { parameter: '댐퍼 Slow Rebound', direction: 'up', detail: '슬로우 리바운드 단단하게', priority: 'primary' },
      { parameter: 'ARB', direction: 'up', detail: '앞뒤 ARB 모두 한 단계 단단', priority: 'secondary' }
    ]
  },
  {
    id: 'too_stiff',
    icon: '🧱',
    label: '차가 너무 딱딱/그립 부족',
    description: '전체적으로 노면 따라가지 못함',
    adjustments: [
      { parameter: 'Wheel Rate', direction: 'down', detail: '스프링 -1~2', priority: 'primary' },
      { parameter: '댐퍼 Slow', direction: 'down', detail: '슬로우 범프/리바운드 부드럽게', priority: 'primary' },
      { parameter: 'ARB', direction: 'down', detail: '앞뒤 ARB 부드럽게', priority: 'secondary' }
    ]
  },
  {
    id: 'fuel_short',
    icon: '⛽',
    label: '연료 부족으로 완주 실패',
    description: '마지막 랩에 연료 다 떨어짐',
    adjustments: [
      { parameter: '연료', direction: 'up', detail: '다음 레이스 연료 +2~3L 여유', priority: 'primary' },
      { parameter: 'fuelMix', direction: 'down', detail: 'fuelMix 단계 1로 (절약 모드)', priority: 'secondary' },
      { parameter: 'ECU Map', direction: 'down', detail: '맵 절약형으로', priority: 'secondary' }
    ]
  },
  {
    id: 'gear_short',
    icon: '🎯',
    label: '직선 끝에서 기어 닿음 (레브)',
    description: '장직선에서 레드존 / 리미터',
    adjustments: [
      { parameter: '최종 기어비', direction: 'up', detail: '기어비 더 길게 (가능 시)', priority: 'primary' },
      { parameter: '뒤 윙', direction: 'down', detail: '윙 줄여 최고속 ↑', priority: 'secondary' }
    ]
  },
  {
    id: 'gear_long',
    icon: '🎯',
    label: '직선 끝까지 못 당김',
    description: '기어가 너무 길어 가속 약함',
    adjustments: [
      { parameter: '최종 기어비', direction: 'down', detail: '기어비 더 짧게', priority: 'primary' },
      { parameter: '뒤 윙', direction: 'up', detail: '윙 늘려 코너 시간 ↓ (다른 트레이드오프)', priority: 'secondary' }
    ]
  }
];

export function getTuningAdjustments(selectedIds: string[]) {
  const selectedSymptoms = tuningSymptoms.filter((symptom) => selectedIds.includes(symptom.id));
  const adjustmentMap = new Map<string, TuningAdjustment & { score: number; count: number }>();

  selectedSymptoms.forEach((symptom) => {
    symptom.adjustments.forEach((adjustment) => {
      const key = `${adjustment.parameter}-${adjustment.direction}`;
      const current = adjustmentMap.get(key);
      const weight = adjustment.priority === 'primary' ? 3 : 1;

      if (!current) {
        adjustmentMap.set(key, { ...adjustment, score: weight, count: 1 });
        return;
      }

      adjustmentMap.set(key, {
        ...current,
        detail: current.detail === adjustment.detail ? current.detail : `${current.detail} / ${adjustment.detail}`,
        score: current.score + weight,
        count: current.count + 1
      });
    });
  });

  return [...adjustmentMap.values()].sort((a, b) => b.score - a.score);
}
