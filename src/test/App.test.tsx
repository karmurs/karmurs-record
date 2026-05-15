import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('Karmurs Record homepage', () => {
  it('renders the site title, script phrase, and anchor-based navigation', () => {
    render(<App />);

    expect(screen.getByRole('link', { name: "Karmurs' Record" })).toHaveAttribute(
      'href',
      '#home'
    );
    expect(
      screen.getByRole('heading', { name: /Things worth keeping in my record/i })
    ).toBeInTheDocument();

    const mainNav = screen.getByRole('navigation', { name: 'Main sections' });
    expect(mainNav).toBeInTheDocument();
    expect(within(mainNav).getByRole('link', { name: 'HOME' })).toHaveAttribute('href', '#home');

    const primaryCards = screen.getByRole('navigation', { name: 'Primary record sections' });
    const journalCard = within(primaryCards).getByRole('link', { name: /Journal/i });
    const galleryCard = within(primaryCards).getByRole('link', { name: /Gallery/i });
    const racingCard = within(primaryCards).getByRole('link', { name: /Racing/i });

    expect(journalCard).toHaveAttribute('href', '#journal');
    expect(galleryCard).toHaveAttribute('href', '#gallery');
    expect(racingCard).toHaveAttribute('href', '#racing');

    const quickNav = screen.getByRole('navigation', { name: 'Quick record navigation' });
    expect(quickNav).toBeInTheDocument();
    expect(within(quickNav).getByRole('link', { name: '오늘' })).toHaveAttribute('href', '#today');
    expect(within(quickNav).getByRole('link', { name: '사진' })).toHaveAttribute(
      'href',
      '#gallery'
    );
    expect(within(quickNav).getByRole('link', { name: '레이싱' })).toHaveAttribute(
      'href',
      '#racing'
    );
    expect(within(quickNav).getByRole('link', { name: '기록함' })).toHaveAttribute(
      'href',
      '#timeline'
    );
  });
});
