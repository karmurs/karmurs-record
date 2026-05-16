import type { ReactNode } from 'react';
import type { View } from '../App';

const topNavItems = [
  { label: 'HOME', view: { name: 'home' } },
  { label: 'JOURNAL', view: { name: 'section', section: 'journal' } },
  { label: 'GALLERY', view: { name: 'section', section: 'gallery' } },
  { label: 'RACING', view: { name: 'section', section: 'racing' } },
  { label: 'DEVLOG', view: { name: 'section', section: 'devlog' } }
] satisfies { label: string; view: View }[];

const floatingNavItems = [
  { label: '오늘', view: { name: 'section', section: 'journal' } },
  { label: '사진', view: { name: 'section', section: 'gallery' } },
  { label: '레이싱', view: { name: 'section', section: 'racing' } },
  { label: '개발', view: { name: 'section', section: 'devlog' } },
  { label: '기록함', view: { name: 'section', section: 'archive' } }
] satisfies { label: string; view: View }[];

type SiteShellProps = {
  children: ReactNode;
  onNavigate: (view: View) => void;
};

export default function SiteShell({ children, onNavigate }: SiteShellProps) {
  return (
    <div className="site-shell" id="home">
      <header className="site-header" aria-label="Primary">
        <button
          className="brand button-reset"
          onClick={() => onNavigate({ name: 'home' })}
          type="button"
        >
          Karmurs' Record
        </button>
        <nav className="top-nav" aria-label="Main sections">
          {topNavItems.map((item) => (
            <button key={item.label} onClick={() => onNavigate(item.view)} type="button">
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {children}

      <nav className="floating-nav" aria-label="Quick record navigation">
        {floatingNavItems.map((item) => (
          <button key={item.label} onClick={() => onNavigate(item.view)} type="button">
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
