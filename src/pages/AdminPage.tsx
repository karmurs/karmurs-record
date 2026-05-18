import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { View } from '../App';
import AdminRecordList from '../components/AdminRecordList';
import AdminRecordForm from '../components/AdminRecordForm';
import SiteShell from '../components/SiteShell';
import {
  getAdminSession,
  isSupabaseConfigured,
  onAdminAuthChange,
  signInAdmin,
  signOutAdmin
} from '../lib/adminAuth';

type AdminPageProps = {
  onNavigate: (view: View) => void;
};

export default function AdminPage({ onNavigate }: AdminPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState(isSupabaseConfigured ? 'Checking session...' : '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!isSupabaseConfigured) {
      return undefined;
    }

    getAdminSession().then((result) => {
      if (!isMounted) {
        return;
      }

      setSession(result.session);
      setStatus(result.error ?? '');
    });

    const unsubscribe = onAdminAuthChange((nextSession) => {
      setSession(nextSession);
      setStatus('');
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus('');

    const result = await signInAdmin(email, password);

    setIsSubmitting(false);
    setSession(result.session);
    setStatus(result.error ?? '');
  };

  const handleSignOut = async () => {
    setIsSubmitting(true);
    const result = await signOutAdmin();
    setIsSubmitting(false);

    if (!result.error) {
      setSession(null);
    }

    setStatus(result.error ?? '');
  };

  return (
    <SiteShell onNavigate={onNavigate}>
      <main className="page-panel admin-page-panel">
        <section className="admin-shell" aria-label="Admin area">
          <div className="admin-copy">
            <p className="hero-kicker">private console</p>
            <h1>Admin login</h1>
            <p>
              글, 사진, Devlog, 레이싱 셋업 입력을 위한 관리자 공간입니다. Supabase 로그인과 RLS 정책을
              기준으로 보호합니다.
            </p>
          </div>

          {!isSupabaseConfigured ? (
            <div className="admin-card" role="status">
              <strong>Supabase env is not configured.</strong>
              <p>
                `.env.local`에 `VITE_SUPABASE_URL`과 `VITE_SUPABASE_ANON_KEY`를 넣으면 로그인 입력이
                활성화됩니다.
              </p>
            </div>
          ) : session ? (
            <>
              <div className="admin-card admin-dashboard">
                <div>
                  <span className="admin-card-kicker">signed in</span>
                  <strong>{session.user.email ?? 'Admin session'}</strong>
                  <p>새 글을 draft로 저장한 뒤, 확인이 끝난 기록만 public으로 전환합니다.</p>
                </div>
                <button className="admin-submit" disabled={isSubmitting} onClick={handleSignOut} type="button">
                  Sign out
                </button>
              </div>

              <AdminRecordForm userId={session.user.id} />
              <AdminRecordList userId={session.user.id} />
            </>
          ) : (
            <form className="admin-card admin-login-form" onSubmit={handleSubmit}>
              <label>
                Email
                <input
                  autoComplete="email"
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  type="email"
                  value={email}
                />
              </label>
              <label>
                Password
                <input
                  autoComplete="current-password"
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  type="password"
                  value={password}
                />
              </label>
              <button className="admin-submit" disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
              {status ? <p className="admin-status">{status}</p> : null}
            </form>
          )}
        </section>
      </main>
    </SiteShell>
  );
}
