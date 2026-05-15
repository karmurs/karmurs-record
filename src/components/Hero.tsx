import { primarySections } from '../data/records';

export default function Hero() {
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

      <div className="primary-card-grid" aria-label="Primary record sections">
        {primarySections.map((section) => (
          <a
            className={`primary-card primary-card-${section.id}`}
            href={`#${section.id}`}
            id={section.id}
            key={section.id}
          >
            <span className="card-eyebrow">{section.eyebrow}</span>
            <strong>{section.title}</strong>
            <span>{section.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
