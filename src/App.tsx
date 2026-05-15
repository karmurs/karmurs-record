import { useState } from 'react';
import type { RecordType } from './data/records';
import HomePage from './pages/HomePage';
import RecordDetailPage from './pages/RecordDetailPage';
import SectionPage from './pages/SectionPage';

export type View =
  | { name: 'home' }
  | { name: 'section'; section: RecordType }
  | { name: 'detail'; recordId: string };

export default function App() {
  const [view, setView] = useState<View>({ name: 'home' });

  if (view.name === 'section') {
    return <SectionPage onNavigate={setView} section={view.section} />;
  }

  if (view.name === 'detail') {
    return <RecordDetailPage onNavigate={setView} recordId={view.recordId} />;
  }

  return <HomePage onNavigate={setView} />;
}
