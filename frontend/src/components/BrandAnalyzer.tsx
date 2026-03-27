
import React from 'react';

interface BrandAnalyzerProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAnalyze: () => void;
  disabled?: boolean;
  isAnalyzing?: boolean;
}

const BrandAnalyzer: React.FC<BrandAnalyzerProps> = ({ value, onChange, onAnalyze, disabled, isAnalyzing }) => {
  return (
    <div className="w-full">
      <label htmlFor="brand_analyzer_input" className="block font-display text-xl font-semibold tracking-tight text-white">
        Brand Signal Scan
      </label>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        Enter a site or company name and we&apos;ll extract voice cues, palette hints, and
        messaging guardrails.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          id="brand_analyzer_input"
          type="text"
          value={value}
          onChange={onChange}
          placeholder="e.g., nike.com or Coca-Cola"
          disabled={disabled || isAnalyzing}
          className="neon-input min-w-0 flex-1 px-5 py-4 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          onKeyDown={(e) => { if (e.key === 'Enter') onAnalyze(); }}
        />
        <button
          type="button"
          onClick={onAnalyze}
          disabled={disabled || isAnalyzing || !value}
          className="neon-ghost-button flex w-full items-center justify-center rounded-[18px] px-6 py-4 text-sm font-semibold sm:w-36"
        >
          {isAnalyzing ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Analyze'
          )}
        </button>
      </div>
    </div>
  );
};

export default BrandAnalyzer;
