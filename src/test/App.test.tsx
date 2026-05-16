import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('Karmurs Record homepage', () => {
  it('renders the site title, script phrase, and in-memory navigation controls', () => {
    render(<App />);

    expect(screen.getByRole('button', { name: "Karmurs' Record" })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Things worth keeping in my record/i })
    ).toBeInTheDocument();

    const mainNav = screen.getByRole('navigation', { name: 'Main sections' });
    expect(mainNav).toBeInTheDocument();
    expect(within(mainNav).getByRole('button', { name: 'HOME' })).toBeInTheDocument();

    const primaryCards = screen.getByRole('navigation', { name: 'Primary record sections' });
    const journalCard = within(primaryCards).getByRole('button', { name: /Journal/i });
    const galleryCard = within(primaryCards).getByRole('button', { name: /Gallery/i });
    const racingCard = within(primaryCards).getByRole('button', { name: /Racing/i });
    const devlogCard = within(primaryCards).getByRole('button', { name: /Devlog/i });

    expect(journalCard).toBeInTheDocument();
    expect(galleryCard).toBeInTheDocument();
    expect(racingCard).toBeInTheDocument();
    expect(devlogCard).toBeInTheDocument();

    const quickNav = screen.getByRole('navigation', { name: 'Quick record navigation' });
    expect(quickNav).toBeInTheDocument();
    expect(within(quickNav).getByRole('button', { name: '오늘' })).toBeInTheDocument();
    expect(within(quickNav).getByRole('button', { name: '사진' })).toBeInTheDocument();
    expect(within(quickNav).getByRole('button', { name: '레이싱' })).toBeInTheDocument();
    expect(within(quickNav).getByRole('button', { name: '개발' })).toBeInTheDocument();
    expect(within(quickNav).getByRole('button', { name: '기록함' })).toBeInTheDocument();
  });

  it('opens a section and then a record detail', async () => {
    const user = userEvent.setup();
    render(<App />);

    const primaryCards = screen.getByRole('navigation', { name: 'Primary record sections' });
    await user.click(within(primaryCards).getByRole('button', { name: /Journal/i }));
    expect(screen.getByRole('heading', { name: 'Journal' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /사이트 이름을 정한 날/i }));
    expect(screen.getByText(/흘려보내기 아까운 것들을 모아두는 공간/)).toBeInTheDocument();
  });

  it('opens the archive as an aggregate record list from quick navigation', async () => {
    const user = userEvent.setup();
    render(<App />);

    const quickNav = screen.getByRole('navigation', { name: 'Quick record navigation' });
    await user.click(within(quickNav).getByRole('button', { name: '기록함' }));

    expect(screen.getByRole('heading', { name: 'Archive' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /사이트 이름을 정한 날/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /첫 무드 보드/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Racing 섹션 자리 잡기/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Devlog 카드 추가/i })).toBeInTheDocument();
  });

  it('opens a real record from the random discovery prompt', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /random/i }));

    expect(screen.getByRole('heading', { name: '첫 무드 보드' })).toBeInTheDocument();
    expect(screen.getByText(/다크 에디토리얼과 손글씨 타이틀/)).toBeInTheDocument();
  });
});
