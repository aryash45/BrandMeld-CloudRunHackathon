import React, { useEffect, useState } from 'react';

interface OutputDisplayProps {
  isLoading: boolean;
  error: string | null;
  content: string;
  onRetry: () => void;
  title?: string;
}

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-4 w-3/4 rounded-full bg-slate-700/50" />
    <div className="h-4 rounded-full bg-slate-700/50" />
    <div className="h-4 rounded-full bg-slate-700/50" />
    <div className="h-4 w-5/6 rounded-full bg-slate-700/50" />
    <div className="h-4 w-1/2 rounded-full bg-slate-700/50" />
  </div>
);

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
  };

  useEffect(() => {
    if (!isCopied) return;
    const timer = setTimeout(() => setIsCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [isCopied]);

  return (
    <button
      onClick={handleCopy}
      className="neon-ghost-button rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em]"
      aria-label="Copy to clipboard"
    >
      {isCopied ? 'Copied' : 'Copy'}
    </button>
  );
};

const OutputDisplay: React.FC<OutputDisplayProps> = ({
  isLoading,
  error,
  content,
  onRetry,
  title = 'Generated Content',
}) => {
  const statusLabel = isLoading ? 'Running' : error ? 'Attention' : content ? 'Ready' : 'Waiting';

  return (
    <div className="neon-panel flex h-full min-h-[420px] w-full flex-col px-5 py-5 sm:px-6 sm:py-6">
      <div className="flex flex-col gap-4 border-b border-white/5 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="neon-kicker">{title === 'Audit Report' ? 'Audit Engine' : 'Output Feed'}</p>
          <h3 className="mt-3 font-display text-2xl font-semibold text-white">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-cyan-400/10 bg-cyan-400/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {statusLabel}
          </span>
          {content && !isLoading && <CopyButton text={content} />}
        </div>
      </div>

      <div className="neon-scroll flex-1 overflow-y-auto pt-5 text-slate-300">
        {isLoading && (
          <div className="animate-fade-in">
            <LoadingSkeleton />
          </div>
        )}

        {error && !isLoading && (
          <div className="flex h-full flex-col items-center justify-center text-center animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="mb-4 h-12 w-12 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-display text-2xl font-semibold text-rose-200">
              The audit hit a snag
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">{error}</p>
            <button
              onClick={onRetry}
              disabled={isLoading}
              className="neon-ghost-button mt-6 rounded-full px-5 py-3 text-sm font-semibold"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !error && !content && (
          <div className="flex h-full flex-col items-center justify-center text-center text-slate-500 animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="mb-4 h-16 w-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            <p className="font-display text-2xl font-semibold text-slate-300">
              {title === 'Audit Report' ? 'Your alignment report will appear here' : 'Generated content will appear here'}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
              Start the workflow on the left to populate this panel.
            </p>
          </div>
        )}

        {!isLoading && content && (
          <div className="animate-fade-in whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-200">
            {content}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputDisplay;
