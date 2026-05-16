import { useCallback, useEffect, useState } from 'react';
import type { RecordType } from './data/records';
import HomePage from './pages/HomePage';
import RecordDetailPage from './pages/RecordDetailPage';
import SectionPage from './pages/SectionPage';

export type View =
  | { name: 'home' }
  | { name: 'section'; section: RecordType }
  | { name: 'detail'; recordId: string };

type HistoryState = {
  view?: View;
};

function getInitialView(): View {
  const state = window.history.state as HistoryState | null;
  return state?.view ?? { name: 'home' };
}

export default function App() {
  const [view, setView] = useState<View>(getInitialView);

  useEffect(() => {
    if (!(window.history.state as HistoryState | null)?.view) {
      window.history.replaceState({ view }, '', window.location.href);
    }

    const handlePopState = (event: PopStateEvent) => {
      const nextState = event.state as HistoryState | null;
      setView(nextState?.view ?? { name: 'home' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((nextView: View) => {
    setView(nextView);
    window.history.pushState({ view: nextView }, '', window.location.href);
  }, []);

  if (view.name === 'section') {
    return <SectionPage onNavigate={navigate} section={view.section} />;
  }

  if (view.name === 'detail') {
    return <RecordDetailPage onNavigate={navigate} recordId={view.recordId} />;
  }

  return <HomePage onNavigate={navigate} />;
}
