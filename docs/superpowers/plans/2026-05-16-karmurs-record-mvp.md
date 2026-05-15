# Karmurs' Record MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first static MVP of Karmurs' Record: a dark editorial personal homepage with Journal, Gallery, and Racing sections backed by local seed data.

**Architecture:** Use a Vite React TypeScript app with static content data in `src/data/records.ts`. Keep presentational components small and focused: layout shell, hero, record cards, section pages, and record detail pages. The first MVP has no login, upload UI, or database.

**Tech Stack:** Vite, React, TypeScript, CSS modules/plain CSS, Vitest, React Testing Library.

---

## File Structure

- Create `package.json`: scripts and dependencies.
- Create `index.html`: app root and noindex metadata.
- Create `vite.config.ts`: Vite React config.
- Create `tsconfig.json` and `tsconfig.node.json`: TypeScript config.
- Create `src/main.tsx`: React mount.
- Create `src/App.tsx`: route-like state and page composition.
- Create `src/styles.css`: global dark editorial design.
- Create `src/data/records.ts`: local seed records and type definitions.
- Create `src/components/SiteShell.tsx`: top nav and bottom pill nav.
- Create `src/components/Hero.tsx`: handwritten hero and primary cards.
- Create `src/components/RecordCard.tsx`: reusable record preview card.
- Create `src/pages/HomePage.tsx`: homepage composition.
- Create `src/pages/SectionPage.tsx`: Journal/Gallery/Racing/Archive lists.
- Create `src/pages/RecordDetailPage.tsx`: single record detail.
- Create `src/test/App.test.tsx`: smoke and navigation tests.
- Create `.gitignore`: Node/build/local files.

## Task 1: Scaffold The App

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `.gitignore`

- [ ] **Step 1: Create project package files**

Create `package.json`:

```json
{
  "name": "karmurs-record",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "vite": "^7.0.0",
    "typescript": "^5.8.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.0",
    "jsdom": "^26.0.0",
    "vitest": "^3.0.0"
  }
}
```

Create `index.html`:

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex,nofollow" />
    <title>Karmurs' Record</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts'
  }
});
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

Create `.gitignore`:

```gitignore
node_modules
dist
.env
.env.local
.superpowers
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`

Expected: `node_modules` is created and no dependency resolution errors occur.

- [ ] **Step 3: Commit scaffold**

```bash
git add package.json package-lock.json index.html vite.config.ts tsconfig.json tsconfig.node.json .gitignore
git commit -m "chore: scaffold Karmurs Record app"
```

## Task 2: Add Record Data Model And Seed Data

**Files:**
- Create: `src/data/records.ts`
- Test: `src/test/records.test.ts`

- [ ] **Step 1: Write data model test**

Create `src/test/records.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { primarySections, records } from '../data/records';

describe('records seed data', () => {
  it('contains homepage primary sections', () => {
    expect(primarySections.map((section) => section.id)).toEqual(['journal', 'gallery', 'racing']);
  });

  it('contains at least one visible record for each primary section', () => {
    for (const section of primarySections) {
      expect(records.some((record) => record.type === section.id && record.visibility === 'link')).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/test/records.test.ts`

Expected: FAIL because `src/data/records.ts` does not exist.

- [ ] **Step 3: Create data model and sample records**

Create `src/data/records.ts`:

```ts
export type RecordType = 'journal' | 'gallery' | 'racing' | 'archive' | 'project' | 'note';

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
  imageTone?: 'warm' | 'mono' | 'racing';
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
  }
];

export function getRecordsByType(type: RecordType) {
  return records.filter((record) => record.type === type && record.visibility === 'link');
}

export function getRecordById(id: string) {
  return records.find((record) => record.id === id && record.visibility === 'link');
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/test/records.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit data model**

```bash
git add src/data/records.ts src/test/records.test.ts
git commit -m "feat: add local record data model"
```

## Task 3: Build Homepage Layout

**Files:**
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/components/SiteShell.tsx`
- Create: `src/components/Hero.tsx`
- Create: `src/pages/HomePage.tsx`
- Create: `src/styles.css`
- Test: `src/test/App.test.tsx`
- Test: `src/test/setup.ts`

- [ ] **Step 1: Write homepage smoke test**

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

Create `src/test/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('Karmurs Record homepage', () => {
  it('renders the site title, script phrase, and primary cards', () => {
    render(<App />);

    expect(screen.getByText("Karmurs' Record")).toBeInTheDocument();
    expect(screen.getByText(/Things/i)).toBeInTheDocument();
    expect(screen.getByText('Journal')).toBeInTheDocument();
    expect(screen.getByText('Gallery')).toBeInTheDocument();
    expect(screen.getByText('Racing')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/test/App.test.tsx`

Expected: FAIL because `src/App.tsx` does not exist.

- [ ] **Step 3: Create React entry and homepage components**

Create `src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

Create `src/App.tsx`:

```tsx
import { HomePage } from './pages/HomePage';

export default function App() {
  return <HomePage />;
}
```

Create `src/components/SiteShell.tsx`:

```tsx
import type { ReactNode } from 'react';

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <main className="site-shell">
      <nav className="top-nav" aria-label="Primary">
        <a className="brand" href="#home">Karmurs&apos; Record</a>
        <div className="nav-links">
          <a className="pill active" href="#home">Home</a>
          <a className="pill" href="#journal">Journal</a>
          <a className="pill" href="#gallery">Gallery</a>
          <a className="pill" href="#racing">Racing</a>
        </div>
      </nav>
      {children}
      <nav className="floating-nav" aria-label="Quick links">
        <a className="pill active" href="#today">오늘</a>
        <a className="pill" href="#gallery">사진</a>
        <a className="pill" href="#racing">레이싱</a>
        <a className="pill" href="#archive">기록함</a>
      </nav>
    </main>
  );
}
```

Create `src/components/Hero.tsx`:

```tsx
import { primarySections } from '../data/records';

export function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-copy">
        <p className="hero-kicker">personal record room</p>
        <h1 className="script-title">
          <span>Things</span>
          <span>worth keeping</span>
        </h1>
        <p className="script-note">in my record</p>
        <p className="hero-description">
          일기, 사진, 레이싱 기록과 작은 기억들을 다시 꺼내볼 수 있게 남겨두는 개인 기록 공간.
        </p>
      </div>

      <div className="primary-card-grid">
        {primarySections.map((section) => (
          <a className={`primary-card ${section.id}`} href={`#${section.id}`} key={section.id}>
            <div className="card-visual" aria-hidden="true">
              <span className="visual-label">{section.eyebrow}</span>
            </div>
            <div>
              <h2>{section.title}</h2>
              <p>{section.label}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
```

Create `src/pages/HomePage.tsx`:

```tsx
import { Hero } from '../components/Hero';
import { SiteShell } from '../components/SiteShell';

export function HomePage() {
  return (
    <SiteShell>
      <Hero />
      <section className="discovery-row" aria-label="Discovery prompts">
        <a href="#today">
          <span>today</span>
          <strong>새 기록 4개가 추가됨</strong>
        </a>
        <a href="#random">
          <span>random</span>
          <strong>아무 기록 하나 열기</strong>
        </a>
        <a href="#timeline">
          <span>timeline</span>
          <strong>시간순으로 둘러보기</strong>
        </a>
      </section>
    </SiteShell>
  );
}
```

Create `src/styles.css` with the full initial design:

```css
:root {
  color: #f5f0e8;
  background: #050505;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background: #050505;
}

a {
  color: inherit;
  text-decoration: none;
}

.site-shell {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  padding: 30px 36px 120px;
  background:
    radial-gradient(circle at 56% 12%, rgba(255, 255, 255, 0.09), transparent 25%),
    radial-gradient(circle at 94% 78%, rgba(183, 139, 87, 0.18), transparent 28%),
    linear-gradient(180deg, #050505 0%, #080706 100%);
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  color: #928c84;
  font-size: 15px;
}

.brand {
  color: #d8d1c7;
  font-weight: 700;
}

.nav-links,
.floating-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pill {
  border-radius: 999px;
  padding: 8px 15px;
  background: rgba(255, 255, 255, 0.1);
  color: #d8d3cc;
}

.pill.active {
  background: #f5f0e8;
  color: #080808;
}

.hero {
  padding-top: 26px;
}

.hero-copy {
  position: relative;
  min-height: 190px;
}

.hero-kicker {
  margin: 0 0 12px;
  color: #928c84;
  font-size: 14px;
}

.script-title {
  display: grid;
  margin: 0;
  max-width: 650px;
  color: #fff;
  font-family: "Segoe Script", "Brush Script MT", cursive;
  font-size: 98px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 0.82;
  transform: rotate(-3deg);
}

.script-note {
  position: absolute;
  left: 395px;
  top: 92px;
  margin: 0;
  color: #c59d70;
  font-family: "Segoe Script", "Brush Script MT", cursive;
  font-size: 36px;
  transform: rotate(8deg);
}

.hero-description {
  position: absolute;
  right: 0;
  bottom: 10px;
  max-width: 360px;
  margin: 0;
  color: #aaa29a;
  font-size: 15px;
  line-height: 1.75;
}

.primary-card-grid {
  display: grid;
  grid-template-columns: 1.05fr 1fr 1fr;
  gap: 24px;
  margin-top: 8px;
}

.primary-card {
  display: flex;
  min-height: 330px;
  flex-direction: column;
  justify-content: space-between;
  padding: 22px;
  border: 1px solid #2b2927;
  border-radius: 20px;
  background: #1a1918;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.48);
}

.primary-card h2 {
  margin: 0;
  color: #f5f0e8;
  font-size: 22px;
}

.primary-card p {
  margin: 7px 0 0;
  color: #8b857e;
  font-size: 13px;
}

.card-visual {
  position: relative;
  height: 190px;
  overflow: hidden;
  border-radius: 16px;
  background: linear-gradient(145deg, #d8c5ad, #7a7d70 58%, #242423);
}

.gallery .card-visual {
  background: linear-gradient(135deg, #1f1f1e, #3c3832);
}

.racing .card-visual {
  background: linear-gradient(135deg, #181818, #302b24);
}

.visual-label {
  position: absolute;
  left: 22px;
  bottom: 18px;
  border-radius: 999px;
  padding: 7px 11px;
  background: rgba(255, 255, 255, 0.13);
  color: #eee;
  font-size: 12px;
}

.discovery-row {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  margin-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
}

.discovery-row a span {
  display: block;
  color: #6f6963;
  font-size: 13px;
}

.discovery-row a strong {
  display: block;
  margin-top: 5px;
  color: #f5f0e8;
  font-size: 16px;
}

.floating-nav {
  position: fixed;
  left: 50%;
  bottom: 24px;
  z-index: 20;
  transform: translateX(-50%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  padding: 6px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
}

@media (max-width: 900px) {
  .site-shell {
    padding: 22px 18px 110px;
  }

  .top-nav {
    align-items: flex-start;
    flex-direction: column;
  }

  .script-title {
    font-size: 64px;
  }

  .script-note,
  .hero-description {
    position: static;
    margin-top: 14px;
  }

  .primary-card-grid,
  .discovery-row {
    grid-template-columns: 1fr;
    display: grid;
  }

  .floating-nav {
    width: calc(100% - 24px);
    justify-content: center;
    overflow-x: auto;
  }
}
```

- [ ] **Step 4: Run homepage test**

Run: `npm test -- src/test/App.test.tsx`

Expected: PASS.

- [ ] **Step 5: Run build**

Run: `npm run build`

Expected: PASS and `dist` is generated.

- [ ] **Step 6: Commit homepage**

```bash
git add src index.html package.json package-lock.json vite.config.ts tsconfig.json tsconfig.node.json .gitignore
git commit -m "feat: build dark editorial homepage"
```

## Task 4: Add Section Lists And Detail View

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/RecordCard.tsx`
- Create: `src/pages/SectionPage.tsx`
- Create: `src/pages/RecordDetailPage.tsx`
- Modify: `src/styles.css`
- Modify: `src/test/App.test.tsx`

- [ ] **Step 1: Add navigation behavior test**

Append to `src/test/App.test.tsx`:

```tsx
import userEvent from '@testing-library/user-event';

it('opens a section and then a record detail', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole('link', { name: /Journal/i }));
  expect(screen.getByRole('heading', { name: 'Journal' })).toBeInTheDocument();

  await user.click(screen.getByRole('link', { name: /사이트 이름을 정한 날/i }));
  expect(screen.getByText(/흘려보내기 아까운 것들을 모아두는 공간/)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/test/App.test.tsx`

Expected: FAIL because links still point to anchors and no detail view exists.

- [ ] **Step 3: Implement simple in-memory navigation**

Modify `src/App.tsx`:

```tsx
import { useState } from 'react';
import { getRecordById, type RecordType } from './data/records';
import { HomePage } from './pages/HomePage';
import { RecordDetailPage } from './pages/RecordDetailPage';
import { SectionPage } from './pages/SectionPage';

export type View =
  | { name: 'home' }
  | { name: 'section'; section: RecordType }
  | { name: 'detail'; recordId: string };

export default function App() {
  const [view, setView] = useState<View>({ name: 'home' });

  if (view.name === 'detail') {
    const record = getRecordById(view.recordId);
    return <RecordDetailPage record={record} onNavigate={setView} />;
  }

  if (view.name === 'section') {
    return <SectionPage section={view.section} onNavigate={setView} />;
  }

  return <HomePage onNavigate={setView} />;
}
```

Modify `src/pages/HomePage.tsx`:

```tsx
import { Hero } from '../components/Hero';
import { SiteShell } from '../components/SiteShell';
import type { View } from '../App';

type HomePageProps = {
  onNavigate: (view: View) => void;
};

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <SiteShell onNavigate={onNavigate}>
      <Hero onNavigate={onNavigate} />
      <section className="discovery-row" aria-label="Discovery prompts">
        <button type="button" onClick={() => onNavigate({ name: 'section', section: 'journal' })}>
          <span>today</span>
          <strong>새 기록 4개가 추가됨</strong>
        </button>
        <button type="button" onClick={() => onNavigate({ name: 'section', section: 'archive' })}>
          <span>random</span>
          <strong>아무 기록 하나 열기</strong>
        </button>
        <button type="button" onClick={() => onNavigate({ name: 'section', section: 'note' })}>
          <span>timeline</span>
          <strong>시간순으로 둘러보기</strong>
        </button>
      </section>
    </SiteShell>
  );
}
```

Modify `src/components/SiteShell.tsx`:

```tsx
import type { ReactNode } from 'react';
import type { View } from '../App';

type SiteShellProps = {
  children: ReactNode;
  onNavigate: (view: View) => void;
};

export function SiteShell({ children, onNavigate }: SiteShellProps) {
  return (
    <main className="site-shell">
      <nav className="top-nav" aria-label="Primary">
        <button className="brand nav-button" type="button" onClick={() => onNavigate({ name: 'home' })}>
          Karmurs&apos; Record
        </button>
        <div className="nav-links">
          <button className="pill active nav-button" type="button" onClick={() => onNavigate({ name: 'home' })}>Home</button>
          <button className="pill nav-button" type="button" onClick={() => onNavigate({ name: 'section', section: 'journal' })}>Journal</button>
          <button className="pill nav-button" type="button" onClick={() => onNavigate({ name: 'section', section: 'gallery' })}>Gallery</button>
          <button className="pill nav-button" type="button" onClick={() => onNavigate({ name: 'section', section: 'racing' })}>Racing</button>
        </div>
      </nav>
      {children}
      <nav className="floating-nav" aria-label="Quick links">
        <button className="pill active nav-button" type="button" onClick={() => onNavigate({ name: 'section', section: 'journal' })}>오늘</button>
        <button className="pill nav-button" type="button" onClick={() => onNavigate({ name: 'section', section: 'gallery' })}>사진</button>
        <button className="pill nav-button" type="button" onClick={() => onNavigate({ name: 'section', section: 'racing' })}>레이싱</button>
        <button className="pill nav-button" type="button" onClick={() => onNavigate({ name: 'section', section: 'archive' })}>기록함</button>
      </nav>
    </main>
  );
}
```

Modify `src/components/Hero.tsx` to use buttons:

```tsx
import type { View } from '../App';
import { primarySections } from '../data/records';

type HeroProps = {
  onNavigate: (view: View) => void;
};

export function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="hero" id="home">
      <div className="hero-copy">
        <p className="hero-kicker">personal record room</p>
        <h1 className="script-title">
          <span>Things</span>
          <span>worth keeping</span>
        </h1>
        <p className="script-note">in my record</p>
        <p className="hero-description">
          일기, 사진, 레이싱 기록과 작은 기억들을 다시 꺼내볼 수 있게 남겨두는 개인 기록 공간.
        </p>
      </div>

      <div className="primary-card-grid">
        {primarySections.map((section) => (
          <button
            className={`primary-card ${section.id}`}
            key={section.id}
            type="button"
            onClick={() => onNavigate({ name: 'section', section: section.id })}
          >
            <div className="card-visual" aria-hidden="true">
              <span className="visual-label">{section.eyebrow}</span>
            </div>
            <div>
              <h2>{section.title}</h2>
              <p>{section.label}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
```

Create `src/components/RecordCard.tsx`:

```tsx
import type { RecordEntry } from '../data/records';

type RecordCardProps = {
  record: RecordEntry;
  onOpen: (id: string) => void;
};

export function RecordCard({ record, onOpen }: RecordCardProps) {
  return (
    <button className="record-card" type="button" onClick={() => onOpen(record.id)}>
      <span>{record.date}</span>
      <h3>{record.title}</h3>
      <p>{record.summary}</p>
    </button>
  );
}
```

Create `src/pages/SectionPage.tsx`:

```tsx
import type { View } from '../App';
import { RecordCard } from '../components/RecordCard';
import { SiteShell } from '../components/SiteShell';
import { getRecordsByType, type RecordType } from '../data/records';

type SectionPageProps = {
  section: RecordType;
  onNavigate: (view: View) => void;
};

export function SectionPage({ section, onNavigate }: SectionPageProps) {
  const sectionRecords = getRecordsByType(section);
  const title = section[0].toUpperCase() + section.slice(1);

  return (
    <SiteShell onNavigate={onNavigate}>
      <section className="page-panel">
        <button className="back-button" type="button" onClick={() => onNavigate({ name: 'home' })}>← Home</button>
        <h1>{title}</h1>
        <div className="record-grid">
          {sectionRecords.map((record) => (
            <RecordCard key={record.id} record={record} onOpen={(recordId) => onNavigate({ name: 'detail', recordId })} />
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
```

Create `src/pages/RecordDetailPage.tsx`:

```tsx
import type { View } from '../App';
import { SiteShell } from '../components/SiteShell';
import type { RecordEntry } from '../data/records';

type RecordDetailPageProps = {
  record: RecordEntry | undefined;
  onNavigate: (view: View) => void;
};

export function RecordDetailPage({ record, onNavigate }: RecordDetailPageProps) {
  return (
    <SiteShell onNavigate={onNavigate}>
      <article className="page-panel detail-panel">
        <button className="back-button" type="button" onClick={() => onNavigate({ name: 'home' })}>← Home</button>
        {record ? (
          <>
            <span className="detail-date">{record.date}</span>
            <h1>{record.title}</h1>
            <p className="detail-summary">{record.summary}</p>
            <p>{record.body}</p>
          </>
        ) : (
          <>
            <h1>Record not found</h1>
            <p>이 기록은 공개 목록에서 찾을 수 없습니다.</p>
          </>
        )}
      </article>
    </SiteShell>
  );
}
```

Append styles:

```css
button {
  font: inherit;
}

.nav-button,
.primary-card,
.record-card,
.discovery-row button,
.back-button {
  cursor: pointer;
  border: 0;
}

.nav-button {
  border: 0;
}

.page-panel {
  margin-top: 44px;
  border: 1px solid #2b2927;
  border-radius: 24px;
  padding: 28px;
  background: rgba(26, 25, 24, 0.86);
}

.page-panel h1 {
  margin: 18px 0 24px;
  font-size: 44px;
}

.back-button {
  border-radius: 999px;
  padding: 9px 14px;
  background: #f5f0e8;
  color: #080808;
}

.record-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.record-card,
.discovery-row button {
  text-align: left;
  border: 1px solid #2b2927;
  border-radius: 18px;
  padding: 18px;
  background: #111;
  color: #f5f0e8;
}

.record-card span,
.detail-date {
  color: #8b857e;
  font-size: 13px;
}

.record-card h3 {
  margin: 14px 0 8px;
}

.record-card p,
.detail-summary {
  color: #aaa29a;
  line-height: 1.7;
}

.detail-panel {
  max-width: 780px;
}

@media (max-width: 900px) {
  .record-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 4: Run tests and build**

Run:

```bash
npm test
npm run build
```

Expected: both PASS.

- [ ] **Step 5: Commit section navigation**

```bash
git add src
git commit -m "feat: add record sections and detail view"
```

## Task 5: Browser Visual Verification

**Files:**
- No source edits unless verification reveals issues.

- [ ] **Step 1: Start dev server**

Run: `npm run dev -- --host 127.0.0.1`

Expected: Vite reports a local URL such as `http://127.0.0.1:5173/`.

- [ ] **Step 2: Verify desktop homepage**

Open the local URL in Chrome.

Expected:

- Dark editorial hero appears.
- `Things worth keeping` is visible and intentionally freeform.
- Cards are `Journal`, `Gallery`, `Racing`.
- Floating nav does not cover important content.

- [ ] **Step 3: Verify mobile homepage**

Use browser responsive mode or Playwright viewport around `390x844`.

Expected:

- No text overlaps.
- Script title remains readable.
- Cards stack vertically.
- Floating nav remains usable.

- [ ] **Step 4: Verify navigation**

Click:

- `Journal` card.
- First Journal record.
- `Home`.
- `Racing` card.

Expected:

- Each section opens.
- Detail page shows title, date, summary, and body.
- Back/Home navigation works.

- [ ] **Step 5: Fix visual issues if needed**

If text overlaps on mobile, reduce `.script-title` font-size in the mobile media query to `56px` and rerun build.

- [ ] **Step 6: Commit verification fixes**

```bash
git add src
git commit -m "fix: polish responsive homepage layout"
```

## Task 6: Document Run And Deployment Notes

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create README**

Create `README.md`:

```md
# Karmurs' Record

Personal homepage and record archive.

## Direction

Dark editorial personal site with a free handwritten hero phrase and three primary entry cards:

- Journal
- Gallery
- Racing

The site starts as a link-access personal record space. It should not be indexed by search engines in the first version.

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm test
npm run build
```

## Content

Initial content lives in `src/data/records.ts`.
```

- [ ] **Step 2: Run final checks**

Run:

```bash
npm test
npm run build
git status --short
```

Expected:

- Tests pass.
- Build passes.
- Only intentional files are changed.

- [ ] **Step 3: Commit docs**

```bash
git add README.md
git commit -m "docs: add project run notes"
```

## Self-Review

Spec coverage:

- Link-access behavior: covered by `noindex` metadata in Task 1.
- Dark editorial homepage: covered by Task 3.
- Handwritten hero: covered by Task 3 CSS.
- Primary cards Journal/Gallery/Racing: covered by Tasks 2 and 3.
- Local seed data: covered by Task 2.
- Section and detail pages: covered by Task 4.
- Responsive layout: covered by Tasks 3 and 5.

Known deferred scope:

- Login, database, upload UI, Chrome capture import, full text search, comments, and guestbook are intentionally deferred from the MVP.
