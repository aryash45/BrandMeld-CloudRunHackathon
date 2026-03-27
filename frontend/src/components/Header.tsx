
import React from 'react';

interface HeaderProps {
  user?: { name: string; email: string } | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="neon-panel px-5 py-6 sm:px-7 sm:py-7">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="max-w-3xl">
          <div className="neon-kicker">Live Brand Studio</div>
          <div className="mt-5 flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(94,242,255,0.55),_rgba(8,16,34,0.1)_38%),linear-gradient(145deg,_rgba(12,22,44,0.95),_rgba(6,13,28,0.88))] shadow-[0_0_28px_rgba(94,242,255,0.18)]">
              <span className="font-display text-lg font-bold text-white">BM</span>
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                BrandMeld Control Room
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Shape voice, launch multi-channel content, and audit every draft from one
                neon dashboard.
              </p>
            </div>
          </div>
        </div>

        {user && onLogout && (
          <div className="neon-panel-soft flex flex-col gap-4 px-5 py-5 sm:min-w-[320px]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Active Session
                </p>
                <p className="mt-2 font-display text-2xl font-semibold text-white">
                  {user.name}
                </p>
                <p className="mt-1 text-sm text-slate-400">{user.email}</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-[linear-gradient(135deg,_rgba(94,242,255,0.25),_rgba(183,255,82,0.14))] text-lg font-bold text-white shadow-[0_0_24px_rgba(94,242,255,0.16)]">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-slate-950/30 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <span className="status-orb" />
                AI workflows synced
              </div>
              <button
                onClick={onLogout}
                className="neon-ghost-button rounded-full px-4 py-2 text-sm font-semibold"
              >
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
