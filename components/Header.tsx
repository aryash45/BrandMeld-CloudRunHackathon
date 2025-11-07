import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center border-b border-slate-700 pb-6">
      <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
        BrandMeld
      </h1>
      <p className="mt-4 text-xl sm:text-2xl font-medium text-slate-300">
        Create & Critique Your Brand's Voice—Instantly.
      </p>
      <p className="mt-3 max-w-3xl mx-auto text-lg text-slate-400">
        Analyze Your  brand's voice, generate new content, or audit your own.
      </p>
       <p className="mt-2 text-sm text-slate-500">
        Our AI-Analyzer uses live data to provide a trustworthy, accurate analysis.
      </p>
    </header>
  );
};

export default Header;