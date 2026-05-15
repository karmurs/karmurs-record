import Hero from '../components/Hero';
import SiteShell from '../components/SiteShell';

const discoveryItems = [
  {
    id: 'today',
    title: 'today',
    text: '오늘 남긴 기록과 가장 최근에 붙잡아 둔 생각.'
  },
  {
    id: 'random',
    title: 'random',
    text: '오래된 사진, 문장, 레이싱 메모를 우연히 다시 꺼내기.'
  },
  {
    id: 'timeline',
    title: 'timeline',
    text: '글, 사진, 세션 기록을 날짜 순서로 천천히 훑어보기.'
  }
];

export default function HomePage() {
  return (
    <SiteShell>
      <main>
        <Hero />
        <section className="discovery-row" aria-label="Discovery prompts">
          {discoveryItems.map((item) => (
            <a className="discovery-link" href={`#${item.id}`} id={item.id} key={item.id}>
              <span>{item.title}</span>
              <p>{item.text}</p>
            </a>
          ))}
        </section>
      </main>
    </SiteShell>
  );
}
