import type { View } from '../App';
import { primarySections } from '../data/records';

type HeroProps = {
  onNavigate: (view: View) => void;
};

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="hero-kicker">private archive / personal record</p>
        <h1 id="hero-title" className="script-title">
          <span>Things worth keeping</span>
          <span>in my record</span>
        </h1>
        <p className="hero-description">
          흘려보내기 아까운 글, 사진, 레이싱 기록을 한 곳에 조용히 모아두는 개인 기록 공간.
        </p>
      </div>

      <nav className="primary-card-grid" aria-label="Primary record sections">
        {primarySections.map((section) => (
          <button
            className={`primary-card primary-card-${section.id}`}
            key={section.id}
            onClick={() => onNavigate({ name: 'section', section: section.id })}
            type="button"
          >
            <span className="card-eyebrow">{section.eyebrow}</span>
            <strong>{section.title}</strong>
            <span>{section.label}</span>
          </button>
        ))}
      </nav>
    </section>
  );
}
