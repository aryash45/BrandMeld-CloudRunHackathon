import React from 'react';

export interface HistoryItem {
  id: number;
  brandVoice: string;
  contentRequest: string;
  generatedContent: string;
}

interface HistoryPanelProps {
  history: HistoryItem[];
  onLoadItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onLoadItem, onClearHistory }) => {
  const containerClasses = `
    h-full w-full bg-slate-800/50 border-2 border-slate-700/80 rounded-lg p-6 relative shadow-2xl shadow-slate-900/50 
    transition-all duration-300 ease-in-out
  `;

  if (history.length === 0) {
    return (
      <div className={containerClasses.trim()}>
        <div className="flex flex-col items-center justify-center h-full text-center text-slate-500" style={{minHeight: '22rem'}}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-semibold text-lg">No history yet</p>
          <p className="text-sm mt-1">Your generated content will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses.trim()}>
        <div className="absolute top-4 right-4">
            <button
                onClick={onClearHistory}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-600/20 text-red-400 text-xs font-medium rounded-md hover:bg-red-600/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500 transition-all duration-200"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear History
            </button>
        </div>
        <div className="space-y-4 h-full overflow-y-auto" style={{minHeight: '22rem'}}>
            {history.map(item => (
                <div key={item.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/60 hover:border-teal-500/50 transition-colors duration-200">
                    <p className="text-sm text-slate-400 font-medium line-clamp-1"><strong>Voice:</strong> {item.brandVoice}</p>
                    <p className="text-sm text-slate-400 font-medium mt-1 line-clamp-1"><strong>Request:</strong> {item.contentRequest}</p>
                    <div className="mt-3 pt-3 border-t border-slate-700/60">
                         <p className="text-slate-300 text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: item.generatedContent.replace(/<\/?[^>]+(>|$)/g, " ") }}></p>
                    </div>
                    <button 
                        onClick={() => onLoadItem(item)} 
                        className="text-xs font-semibold text-teal-400 hover:text-teal-300 mt-3"
                    >
                        Load this session →
                    </button>
                </div>
            ))}
        </div>
    </div>
  );
};

export default HistoryPanel;