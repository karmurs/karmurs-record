import type { View } from '../App';
import Hero from '../components/Hero';
import SiteShell from '../components/SiteShell';
import type { RecordType } from '../data/records';

const discoveryItems = [
  {
    id: 'today',
    title: 'today',
    text: '오늘 남긴 기록과 가장 최근에 붙잡아 둔 생각.',
    section: 'journal'
  },
  {
    id: 'random',
    title: 'random',
    text: '오래된 사진, 문장, 레이싱 메모를 우연히 다시 꺼내기.',
    section: 'note'
  },
  {
    id: 'timeline',
    title: 'timeline',
    text: '글, 사진, 세션 기록을 날짜 순서로 천천히 훑어보기.',
    section: 'archive'
  }
] satisfies { id: string; title: string; text: string; section: RecordType }[];

type HomePageProps = {
  onNavigate: (view: View) => void;
};

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <SiteShell onNavigate={onNavigate}>
      <main>
        <Hero onNavigate={onNavigate} />
        <section className="discovery-row" aria-label="Discovery prompts">
          {discoveryItems.map((item) => (
            <button
              className="discovery-link"
              key={item.id}
              onClick={() => onNavigate({ name: 'section', section: item.section })}
              type="button"
            >
              <span className="discovery-title">{item.title}</span>
              <span className="discovery-copy">{item.text}</span>
            </button>
          ))}
        </section>
      </main>
    </SiteShell>
  );
}
