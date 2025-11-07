
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
    <div className="w-full pb-8 border-b border-slate-700/50">
      <label htmlFor="brand_analyzer_input" className="block text-lg font-semibold mb-3 text-slate-300">
        Let us analyze your brand
      </label>
      <div className="flex items-center gap-3">
        <input
          id="brand_analyzer_input"
          type="text"
          value={value}
          onChange={onChange}
          placeholder="e.g., nike.com or Coca-Cola"
          disabled={disabled || isAnalyzing}
          className="flex-grow p-4 bg-slate-800 border-2 border-slate-700 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          onKeyDown={(e) => { if (e.key === 'Enter') onAnalyze(); }}
        />
        <button
          type="button"
          onClick={onAnalyze}
          disabled={disabled || isAnalyzing || !value}
          className="w-32 flex items-center justify-center px-6 py-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-teal-500 transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
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