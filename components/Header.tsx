
import React from 'react';

interface HeaderProps {
  user?: { name: string; email: string } | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="relative text-center border-b border-slate-800 pb-8">
      {user && onLogout && (
        <div className="absolute top-0 right-0 flex items-center gap-4">
           <div className="hidden sm:block text-right">
             <p className="text-sm font-semibold text-slate-200">{user.name}</p>
             <p className="text-xs text-slate-500">{user.email}</p>
           </div>
           <div className="h-10 w-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              {user.name.charAt(0).toUpperCase()}
           </div>
           <button 
             onClick={onLogout}
             className="text-xs text-slate-400 hover:text-white underline underline-offset-4"
           >
             Log Out
           </button>
        </div>
      )}

      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 tracking-tight">
        BrandMeld
      </h1>
      <p className="mt-4 text-xl sm:text-2xl font-medium text-slate-300">
        Your AI Personal Brand Architect.
      </p>
      <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-400">
        Stop sounding generic. Create content that actually sounds like <span className="text-teal-400 font-semibold">you</span>.
      </p>
    </header>
  );
};

export default Header;
