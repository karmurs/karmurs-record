import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('Karmurs Record homepage', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

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

    await user.click(screen.getByRole('button', { name: /Karmurs' Record를 여는 기준/i }));
    expect(screen.getByText(/짧은 생각, 오래 보고 싶은 문장/)).toBeInTheDocument();
  });

  it('opens the archive as an aggregate record list from quick navigation', async () => {
    const user = userEvent.setup();
    render(<App />);

    const quickNav = screen.getByRole('navigation', { name: 'Quick record navigation' });
    await user.click(within(quickNav).getByRole('button', { name: '기록함' }));

    expect(screen.getByRole('heading', { name: 'Archive' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Karmurs' Record를 여는 기준/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /첫 화면의 무드 보드/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Racing 기록장의 첫 구조/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Devlog를 메인에 남긴 이유/i })).toBeInTheDocument();
  });

  it('filters archive records by section type', async () => {
    const user = userEvent.setup();
    render(<App />);

    const quickNav = screen.getByRole('navigation', { name: 'Quick record navigation' });
    await user.click(within(quickNav).getByRole('button', { name: '기록함' }));

    const filters = screen.getByRole('group', { name: 'Archive filters' });
    await user.click(within(filters).getByRole('button', { name: /Devlog/i }));

    expect(screen.getByRole('button', { name: /Devlog를 메인에 남긴 이유/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Karmurs' Record를 여는 기준/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /첫 화면의 무드 보드/i })).not.toBeInTheDocument();

    await user.click(within(filters).getByRole('button', { name: /^All\b/i }));

    expect(screen.getByRole('button', { name: /Karmurs' Record를 여는 기준/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Devlog를 메인에 남긴 이유/i })).toBeInTheDocument();
  });

  it('searches archive records across text and tags', async () => {
    const user = userEvent.setup();
    render(<App />);

    const quickNav = screen.getByRole('navigation', { name: 'Quick record navigation' });
    await user.click(within(quickNav).getByRole('button', { name: '기록함' }));

    await user.type(screen.getByLabelText('Search archive'), 'decision');

    expect(screen.getByRole('button', { name: /Devlog를 메인에 남긴 이유/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /첫 화면의 무드 보드/i })).not.toBeInTheDocument();

    await user.clear(screen.getByLabelText('Search archive'));
    await user.type(screen.getByLabelText('Search archive'), 'nothing-matches-this');

    expect(screen.getByText('맞는 기록을 찾지 못했어요.')).toBeInTheDocument();
  });

  it('renders the racing records explorer with game menus and session filters', async () => {
    const user = userEvent.setup();
    render(<App />);

    const primaryCards = screen.getByRole('navigation', { name: 'Primary record sections' });
    await user.click(within(primaryCards).getByRole('button', { name: /Racing/i }));

    expect(screen.getByRole('heading', { name: 'Racing' })).toBeInTheDocument();
    const racingExplorer = screen.getByRole('region', { name: 'Racing records explorer' });
    expect(within(racingExplorer).getByRole('img', { name: 'Spa-Francorchamps track' }))
      .toBeInTheDocument();
    expect(within(racingExplorer).getByText('Track photo')).toBeInTheDocument();
    expect(within(racingExplorer).getByText('Car photo')).toBeInTheDocument();
    expect(within(racingExplorer).queryByRole('img', { name: 'Monza thumbnail' }))
      .not.toBeInTheDocument();
    expect(within(racingExplorer).queryByRole('img', { name: 'Ferrari 296 GT3 thumbnail' }))
      .not.toBeInTheDocument();
    expect(within(racingExplorer).getByRole('img', { name: 'BMW badge' })).toBeInTheDocument();
    expect(within(racingExplorer).getByRole('button', { name: /Assetto Corsa Competizione/i }))
      .toBeInTheDocument();
    expect(within(racingExplorer).getByRole('button', { name: /Assetto Corsa EVO/i }))
      .toBeInTheDocument();
    expect(within(racingExplorer).getByRole('button', { name: /Le Mans Ultimate/i }))
      .toBeInTheDocument();

    await user.click(within(racingExplorer).getByRole('button', { name: /Le Mans Ultimate/i }));

    expect(
      within(racingExplorer).getByRole('heading', { name: 'Le Mans Ultimate' })
    ).toBeInTheDocument();
    expect(within(racingExplorer).getAllByText('Fuji Speedway').length).toBeGreaterThan(1);
    expect(within(racingExplorer).getByRole('img', { name: 'Fuji Speedway track' }))
      .toBeInTheDocument();

    await user.click(within(racingExplorer).getByRole('button', { name: 'Race' }));

    expect(within(racingExplorer).queryByText('Fuji Speedway')).not.toBeInTheDocument();
  });

  it('shows imported racing laps by game and track', async () => {
    const user = userEvent.setup();
    render(<App />);

    const primaryCards = screen.getByRole('navigation', { name: 'Primary record sections' });
    await user.click(within(primaryCards).getByRole('button', { name: /Racing/i }));

    const racingExplorer = screen.getByRole('region', { name: 'Racing records explorer' });
    await user.click(within(racingExplorer).getByRole('button', { name: /Assetto Corsa EVO/i }));

    const importedPanel = within(racingExplorer).getByRole('region', {
      name: /Assetto Corsa EVO imported racing records/i
    });
    expect(within(importedPanel).getByText('Imported DeltaLine laps')).toBeInTheDocument();
    expect(within(importedPanel).getByText(/Last sync/i)).toBeInTheDocument();
    expect(
      within(importedPanel).getByRole('generic', { name: 'Racing import source statuses' })
    ).toBeInTheDocument();
    expect(within(importedPanel).getAllByText('33').length).toBeGreaterThan(0);
    expect(within(importedPanel).getByRole('button', { name: /Brands Hatch Indy/i })).toBeInTheDocument();

    await user.click(within(importedPanel).getByRole('button', { name: /Brands Hatch Indy/i }));

    const bestLaps = within(importedPanel).getByRole('table', {
      name: /Assetto Corsa EVO imported best laps/i
    });
    expect(within(importedPanel).getByText('Selected track trend')).toBeInTheDocument();
    expect(within(bestLaps).getByText('Hyundai i30 N Hatchback')).toBeInTheDocument();
    expect(within(bestLaps).queryByText('Nurburgring 24h')).not.toBeInTheDocument();
  });

  it('opens a real record from the random discovery prompt', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /random/i }));

    expect(screen.getByRole('heading', { name: '첫 화면의 무드 보드' })).toBeInTheDocument();
    expect(screen.getByText(/설명보다 분위기로 기억되게 둔다/)).toBeInTheDocument();
  });

  it('supports browser back navigation between in-memory views', async () => {
    const user = userEvent.setup();
    render(<App />);

    const primaryCards = screen.getByRole('navigation', { name: 'Primary record sections' });
    await user.click(within(primaryCards).getByRole('button', { name: /Devlog/i }));
    expect(screen.getByRole('heading', { name: 'Devlog' })).toBeInTheDocument();

    window.history.back();

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Things worth keeping in my record/i })
      ).toBeInTheDocument();
    });
  });
});
