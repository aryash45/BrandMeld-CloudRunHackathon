import React, { useState } from 'react';
import { Platform, PLATFORM_META } from '../services/apiService';
import ReactMarkdown from 'react-markdown';

interface BatchOutputDisplayProps {
  isLoading: boolean;
  error: string | null;
  results: Partial<Record<Platform, string>>;
  selectedPlatforms: Platform[];
  onRetry: () => void;
}

const CopyIcon: React.FC<{ copied: boolean }> = ({ copied }) =>
  copied ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
      <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
    </svg>
  );

const Skeleton: React.FC = () => (
  <div className="space-y-3 animate-pulse pt-2">
    {[80, 60, 90, 50, 70].map((w, i) => (
      <div key={i} className="h-4 rounded-full bg-slate-700/60" style={{ width: `${w}%` }} />
    ))}
  </div>
);

const PlatformContent: React.FC<{ content: string }> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const charCount = content.length;

  return (
    <div className="relative h-full">
      <button
        onClick={handleCopy}
        title="Copy to clipboard"
        className="absolute top-0 right-0 flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-400 transition-colors px-2 py-1 rounded-md hover:bg-slate-700/50"
      >
        <CopyIcon copied={copied} />
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <div className="prose prose-invert prose-sm max-w-none pr-16 overflow-y-auto max-h-[55vh] leading-relaxed">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-700/50 text-xs text-slate-500 text-right">
        {charCount.toLocaleString()} characters
      </div>
    </div>
  );
};

const BatchOutputDisplay: React.FC<BatchOutputDisplayProps> = ({
  isLoading,
  error,
  results,
  selectedPlatforms,
  onRetry,
}) => {
  const availablePlatforms = selectedPlatforms.filter((p) => results[p]);
  const [activeTab, setActiveTab] = useState<Platform | null>(null);

  // Auto-switch to first available tab when results arrive
  const effectiveTab: Platform | null =
    activeTab && availablePlatforms.includes(activeTab)
      ? activeTab
      : availablePlatforms[0] ?? null;

  const hasContent = availablePlatforms.length > 0;

  return (
    <div className="h-full flex flex-col bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
      {/* Empty / loading state */}
      {!hasContent && !error && (
        <div className="flex-1 flex flex-col">
          {isLoading ? (
            <div>
              <div className="flex gap-2 mb-6">
                {selectedPlatforms.map((p) => (
                  <div key={p} className="h-8 w-24 rounded-lg bg-slate-700/60 animate-pulse" />
                ))}
              </div>
              <Skeleton />
              <p className="mt-6 text-xs text-slate-500 animate-pulse">
                Generating {selectedPlatforms.length} version{selectedPlatforms.length > 1 ? 's' : ''} simultaneously…
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p className="text-sm">Select platforms and generate to see your drafts</p>
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p className="text-red-400 text-sm mb-3">{error}</p>
          <button onClick={onRetry} className="text-teal-400 text-sm hover:underline">Try again</button>
        </div>
      )}

      {/* Tabbed results */}
      {hasContent && (
        <div className="flex flex-col flex-1">
          {/* Tab bar */}
          <div className="flex gap-1 mb-5 border-b border-slate-700/60 pb-0">
            {availablePlatforms.map((platform) => {
              const meta = PLATFORM_META[platform];
              const isActive = platform === effectiveTab;
              return (
                <button
                  key={platform}
                  onClick={() => setActiveTab(platform)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-t-md border-b-2 transition-all duration-150 -mb-px
                    ${isActive
                      ? `border-teal-400 text-teal-300 bg-slate-700/30`
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-700/20'
                    }`}
                >
                  <span className={isActive ? meta.color : ''}>{meta.icon}</span>
                  {meta.label}
                </button>
              );
            })}
            {/* Still loading remaining tabs */}
            {isLoading && selectedPlatforms
              .filter((p) => !results[p])
              .map((p) => (
                <div key={p} className="px-4 py-2 text-sm text-slate-600 animate-pulse">{PLATFORM_META[p].label}…</div>
              ))}
          </div>

          {/* Active tab content */}
          {effectiveTab && results[effectiveTab] && (
            <PlatformContent key={effectiveTab} content={results[effectiveTab]!} />
          )}
        </div>
      )}
    </div>
  );
};

export default BatchOutputDisplay;
