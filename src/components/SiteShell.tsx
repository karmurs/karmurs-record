import type { ReactNode } from 'react';

const topNavItems = [
  { label: 'HOME', href: '#home' },
  { label: 'JOURNAL', href: '#journal' },
  { label: 'GALLERY', href: '#gallery' },
  { label: 'RACING', href: '#racing' }
];

const floatingNavItems = [
  { label: '오늘', href: '#today' },
  { label: '사진', href: '#gallery' },
  { label: '레이싱', href: '#racing' },
  { label: '기록함', href: '#timeline' }
];

type SiteShellProps = {
  children: ReactNode;
};

export default function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="site-shell" id="home">
      <header className="site-header" aria-label="Primary">
        <a className="brand" href="#home">
          Karmurs' Record
        </a>
        <nav className="top-nav" aria-label="Main sections">
          {topNavItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      {children}

      <nav className="floating-nav" aria-label="Quick record navigation">
        {floatingNavItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
