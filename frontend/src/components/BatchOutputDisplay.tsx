import React from 'react';
import { Platform, PLATFORM_META } from '../services/apiService';

interface BatchOutputDisplayProps {
  isLoading: boolean;
  error: string | null;
  results: Partial<Record<Platform, string>>;
  selectedPlatforms: Platform[];
  activeTab: Platform | null;
  onTabChange: (platform: Platform) => void;
  onRetry: () => void;
}

const CopyIcon: React.FC<{ copied: boolean }> = ({ copied }) =>
  copied ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-300" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
      <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
    </svg>
  );

const Skeleton: React.FC = () => (
  <div className="space-y-3 animate-pulse pt-2">
    {[82, 64, 90, 58, 76, 72].map((width, index) => (
      <div
        key={index}
        className="h-4 rounded-full bg-slate-700/50"
        style={{ width: `${width}%` }}
      />
    ))}
  </div>
);

const PlatformContent: React.FC<{ content: string }> = ({ content }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          Draft body
        </p>
        <button
          onClick={handleCopy}
          title="Copy to clipboard"
          className="neon-ghost-button flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold"
        >
          <CopyIcon copied={copied} />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="neon-scroll mt-4 flex-1 overflow-y-auto pr-2 text-sm leading-relaxed text-slate-200 whitespace-pre-wrap break-words">
        {content}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/5 pt-4 text-xs text-slate-500">
        <span>Live draft stream</span>
        <span>{content.length.toLocaleString()} characters</span>
      </div>
    </div>
  );
};

const BatchOutputDisplay: React.FC<BatchOutputDisplayProps> = ({
  isLoading,
  error,
  results,
  selectedPlatforms,
  activeTab,
  onTabChange,
  onRetry,
}) => {
  const availablePlatforms = selectedPlatforms.filter((platform) => results[platform]);
  const effectiveTab =
    activeTab && availablePlatforms.includes(activeTab) ? activeTab : availablePlatforms[0] ?? null;
  const hasContent = availablePlatforms.length > 0;

  return (
    <div className="neon-panel flex min-h-[420px] flex-col px-5 py-5 sm:px-6 sm:py-6">
      <div className="flex flex-col gap-4 border-b border-white/5 pb-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="neon-kicker">Draft Matrix</p>
            <h3 className="mt-3 font-display text-2xl font-semibold text-white">
              Multi-platform output
            </h3>
          </div>
          <div className="rounded-full border border-cyan-400/10 bg-cyan-400/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {availablePlatforms.length || selectedPlatforms.length} channel
            {((availablePlatforms.length || selectedPlatforms.length) === 1) ? '' : 's'}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedPlatforms.map((platform) => {
            const meta = PLATFORM_META[platform];
            const isActive = platform === effectiveTab && Boolean(results[platform]);
            const isReady = Boolean(results[platform]);
            return (
              <button
                key={platform}
                onClick={() => isReady && onTabChange(platform)}
                disabled={!isReady}
                className={`neon-tab neon-chip flex items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold ${isActive ? 'is-active' : ''} ${!isReady ? 'cursor-wait opacity-60' : ''}`}
              >
                <span className={`flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-slate-950/40 font-display text-xs font-bold uppercase ${isReady ? meta.color : 'text-slate-500'}`}>
                  {meta.icon}
                </span>
                <span>{meta.label}</span>
                {!isReady && isLoading && <span className="text-slate-500">...</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-5">
        {!hasContent && !error && (
          <div className="flex flex-1 flex-col justify-center">
            {isLoading ? (
              <div>
                <Skeleton />
                <p className="mt-6 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                  Generating {selectedPlatforms.length} version{selectedPlatforms.length > 1 ? 's' : ''} in parallel...
                </p>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="mb-4 h-12 w-12 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <p className="font-display text-xl font-medium text-slate-300">
                  Queue a prompt to light up this relay.
                </p>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                  Select the channels you want, generate a draft, and BrandMeld will stream
                  each version here.
                </p>
              </div>
            )}
          </div>
        )}

        {error && !isLoading && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="font-display text-2xl font-semibold text-rose-300">
              Draft generation stalled
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">{error}</p>
            <button
              onClick={onRetry}
              className="neon-ghost-button mt-6 rounded-full px-5 py-3 text-sm font-semibold"
            >
              Try again
            </button>
          </div>
        )}

        {hasContent && effectiveTab && results[effectiveTab] && (
          <PlatformContent key={effectiveTab} content={results[effectiveTab]!} />
        )}
      </div>
    </div>
  );
};

export default BatchOutputDisplay;
