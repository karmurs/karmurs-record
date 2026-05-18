import { useMemo, useState } from 'react';
import { getTuningAdjustments, tuningSymptoms } from '../data/racingTuningGuide';

export default function RacingTuningGuidePanel() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const adjustments = useMemo(() => getTuningAdjustments(selectedSymptoms), [selectedSymptoms]);

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms((current) =>
      current.includes(symptomId)
        ? current.filter((id) => id !== symptomId)
        : [...current, symptomId]
    );
  };

  return (
    <section className="racing-guide-panel" aria-label="Racing setup and tuning guide">
      <div className="racing-setups-heading">
        <div>
          <p className="hero-kicker">post-race tuning</p>
          <h2>레이스 후 차량 피드백 → 튜닝 가이드</h2>
          <p className="guide-lead">
            레이스 끝나고 느낀 차의 문제점을 클릭하면 무엇을 조정해야 할지 안내합니다 (복수 선택 가능)
          </p>
        </div>
        <span>{selectedSymptoms.length} selected</span>
      </div>

      <div className="tuning-guide-grid">
        <div>
          <div className="symptom-button-grid" role="group" aria-label="Vehicle handling symptoms">
            {tuningSymptoms.map((symptom) => (
              <button
                aria-pressed={selectedSymptoms.includes(symptom.id)}
                className="symptom-button"
                key={symptom.id}
                onClick={() => toggleSymptom(symptom.id)}
                title={symptom.description}
                type="button"
              >
                <span className="symptom-icon" aria-hidden="true">{symptom.icon}</span>
                <strong>{symptom.label}</strong>
              </button>
            ))}
          </div>
        </div>

        <div className="tuning-result-panel" aria-live="polite">
          <div className="tuning-result-heading">
            <p className="guide-section-label">추천 조정</p>
            {selectedSymptoms.length > 0 ? (
              <div className="selected-symptom-list" aria-label="Selected handling symptoms">
                {tuningSymptoms
                  .filter((symptom) => selectedSymptoms.includes(symptom.id))
                  .map((symptom) => (
                    <span key={symptom.id}>{symptom.label}</span>
                  ))}
              </div>
            ) : null}
          </div>
          {adjustments.length > 0 ? (
            <div className="adjustment-list">
              {adjustments.map((adjustment) => (
                <article
                  className={`adjustment-card adjustment-${adjustment.direction}`}
                  key={`${adjustment.parameter}-${adjustment.direction}`}
                >
                  <span>{adjustment.score >= 4 ? '우선' : '참고'}</span>
                  <strong>
                    {adjustment.parameter}
                    <small>{adjustment.direction === 'up' ? '올림 / 단단 / 늘림' : '내림 / 부드럽게 / 줄임'}</small>
                  </strong>
                  <p>{adjustment.detail}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="imported-empty-state">
              주행 후 느낀 증상을 선택하면 조정 후보를 우선순위대로 정리합니다.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
