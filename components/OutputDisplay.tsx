
import React, { useState, useEffect } from 'react';

declare const marked: any;

interface OutputDisplayProps {
  isLoading: boolean;
  error: string | null;
  content: string;
  onRetry: () => void;
  title?: string;
}

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-4 bg-slate-700 rounded w-3/4"></div>
    <div className="h-4 bg-slate-700 rounded"></div>
    <div className="h-4 bg-slate-700 rounded"></div>
    <div className="h-4 bg-slate-700 rounded w-5/6"></div>
    <div className="h-4 bg-slate-700 rounded w-1/2"></div>
  </div>
);

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <button
      onClick={handleCopy}
      className="absolute top-4 right-4 p-2 bg-slate-700/80 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-slate-700 transition-all duration-200"
      aria-label="Copy to clipboard"
    >
      {isCopied ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
};


const OutputDisplay: React.FC<OutputDisplayProps> = ({ isLoading, error, content, onRetry, title = "Generated Content" }) => {
  const renderedHtml = content ? marked.parse(content) : '';

  const containerClasses = `
    h-full w-full bg-slate-800/50 border-2 rounded-lg p-6 relative shadow-2xl shadow-slate-900/50 
    transition-all duration-300 ease-in-out
    ${isLoading 
      ? 'border-teal-500/60 ring-2 ring-teal-500/20' 
      : 'border-slate-700/80'
    }
  `;

  return (
    <div className={containerClasses.trim()}>
      <div className="absolute top-0 left-6 -translate-y-1/2 bg-gray-900 px-2 text-lg font-semibold text-slate-300">
        {title}
      </div>
       {content && !isLoading && <CopyButton text={content} />}
      <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-headings:text-slate-100 h-full overflow-y-auto prose-strong:text-slate-200 prose-a:text-teal-400 prose-ul:list-disc prose-ol:list-decimal" style={{minHeight: '22rem'}}>
        {isLoading && (
          <div className="animate-fade-in">
            <LoadingSkeleton />
          </div>
        )}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-400 font-semibold text-lg">Oops! Something went wrong.</p>
            <p className="text-slate-400 mt-1 max-w-md">{error}</p>
            <button
                onClick={onRetry}
                disabled={isLoading}
                className="mt-6 flex items-center justify-center px-5 py-2 bg-teal-600 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-500 transition-all duration-200 disabled:opacity-50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M20 4h-5v5M4 20h5v-5" />
                </svg>
                Try Again
            </button>
          </div>
        )}
        {!isLoading && !error && !content && (
           <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 animate-fade-in">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
             <p className="font-semibold text-lg">
                {title === 'Audit Report' ? 'Your audit report will be shown here' : 'Your generated content will appear here'}
             </p>
           </div>
        )}
        {!isLoading && content && <div className="animate-fade-in" dangerouslySetInnerHTML={{ __html: renderedHtml }} />}
      </div>
    </div>
  );
};

export default OutputDisplay;