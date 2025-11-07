
import React, { useState, useCallback, useEffect } from 'react';
import { generateContent, analyzeBrandVoice, auditContent } from './services/geminiService';
import Header from './components/Header';
import TextInput from './components/TextInput';
import GenerateButton from './components/GenerateButton';
import OutputDisplay from './components/OutputDisplay';
import ContentTemplates from './components/ContentTemplates';
import BrandAnalyzer from './components/BrandAnalyzer';
import HistoryPanel, { HistoryItem } from './components/HistoryPanel';

type MainView = 'generator' | 'auditor';
type GeneratorOutputView = 'output' | 'history';

const App: React.FC = () => {
  // Main view state
  const [activeMainView, setActiveMainView] = useState<MainView>('generator');

  // Generator state
  const [brandVoice, setBrandVoice] = useState<string>('');
  const [contentRequest, setContentRequest] = useState<string>('');
  const [analyzeUrl, setAnalyzeUrl] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [generatorError, setGeneratorError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeGeneratorView, setActiveGeneratorView] = useState<GeneratorOutputView>('output');

  // Auditor state
  const [auditBrandVoice, setAuditBrandVoice] = useState<string>('');
  const [contentToAudit, setContentToAudit] = useState<string>('');
  const [auditResult, setAuditResult] = useState<string>('');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditError, setAuditError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('brandmeld_history');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to parse history from localStorage", e);
      localStorage.removeItem('brandmeld_history');
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!brandVoice.trim() || !contentRequest.trim()) {
      setGeneratorError('Please fill in both brand voice and content request fields.');
      return;
    }
    
    setIsGenerating(true);
    setGeneratorError(null);
    setGeneratedContent('');
    setActiveGeneratorView('output');

    try {
      const result = await generateContent(brandVoice, contentRequest);
      setGeneratedContent(result);
      const newHistoryItem = { brandVoice, contentRequest, generatedContent: result, id: Date.now() };
      const updatedHistory = [newHistoryItem, ...history].slice(0, 20); // Keep last 20
      setHistory(updatedHistory);
      localStorage.setItem('brandmeld_history', JSON.stringify(updatedHistory));
    } catch (err) {
      setGeneratorError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsGenerating(false);
    }
  }, [brandVoice, contentRequest, history]);
  
  const handleAudit = useCallback(async () => {
    if (!auditBrandVoice.trim() || !contentToAudit.trim()) {
      setAuditError('Please fill in both brand voice and content to audit fields.');
      return;
    }
    
    setIsAuditing(true);
    setAuditError(null);
    setAuditResult('');

    try {
      const result = await auditContent(auditBrandVoice, contentToAudit);
      setAuditResult(result);
    // FIX: Corrected syntax for the catch block.
    } catch (err) {
      setAuditError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsAuditing(false);
    }
  }, [auditBrandVoice, contentToAudit]);

  const handleTemplateSelect = (template: string) => {
    setContentRequest(template);
  };

  const handleAnalyze = useCallback(async () => {
    if (!analyzeUrl.trim()) return;
    
    setIsAnalyzing(true);
    setBrandVoice(''); // Clear previous voice

    try {
      const analyzedVoice = await analyzeBrandVoice(analyzeUrl);
      setBrandVoice(analyzedVoice);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during analysis.';
      setBrandVoice(`Error: ${errorMessage}`);
    } finally {
      setIsAnalyzing(false);
    }
  }, [analyzeUrl]);

  const loadHistoryItem = (item: HistoryItem) => {
    setBrandVoice(item.brandVoice);
    setContentRequest(item.contentRequest);
    setGeneratedContent(item.generatedContent);
    setActiveGeneratorView('output');
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('brandmeld_history');
  }

  const TabButton: React.FC<{view: MainView, label: string}> = ({ view, label }) => (
    <button 
      onClick={() => setActiveMainView(view)}
      className={`px-6 py-3 text-xl font-bold rounded-t-lg transition-colors duration-200 ${activeMainView === view ? 'bg-slate-800/60 text-teal-400' : 'bg-transparent text-slate-400 hover:bg-slate-800/30 hover:text-slate-200'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />

        <div className="mt-10 lg:mt-12 border-b border-slate-700">
          <TabButton view="generator" label="Content Generator" />
          <TabButton view="auditor" label="Voice Auditor" />
        </div>
        
        {activeMainView === 'generator' && (
          <main className="mt-10 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col">
                <BrandAnalyzer
                  value={analyzeUrl}
                  onChange={(e) => setAnalyzeUrl(e.target.value)}
                  onAnalyze={handleAnalyze}
                  disabled={isGenerating}
                  isAnalyzing={isAnalyzing}
                />
                <div className="mt-10">
                  <TextInput
                    id="brand_voice_input"
                    label="1. Define Your Brand Voice"
                    placeholder="e.g., Playful and witty..."
                    value={brandVoice}
                    onChange={(e) => setBrandVoice(e.target.value)}
                    rows={6}
                    disabled={isGenerating || isAnalyzing}
                  />
                </div>
                <div className="mt-8">
                  <ContentTemplates onTemplateSelect={handleTemplateSelect} disabled={isGenerating} />
                </div>
                <div className="mt-8">
                  <TextInput
                    id="content_request_input"
                    label="3. Your Request"
                    placeholder="e.g., A short Instagram post..."
                    value={contentRequest}
                    onChange={(e) => setContentRequest(e.target.value)}
                    rows={6}
                    disabled={isGenerating}
                  />
                </div>
                <div className="mt-12">
                  <GenerateButton
                    onClick={handleGenerate}
                    isLoading={isGenerating}
                    disabled={!brandVoice || !contentRequest || isAnalyzing}
                  >
                    Meld Content
                  </GenerateButton>
                </div>
              </div>

              <div className="mt-12 lg:mt-0">
                <div className="flex border-b border-slate-700 mb-4">
                    <button onClick={() => setActiveGeneratorView('output')} className={`px-4 py-2 text-lg font-semibold transition-colors duration-200 ${activeGeneratorView === 'output' ? 'text-teal-400 border-b-2 border-teal-400' : 'text-slate-400 hover:text-slate-200'}`}>
                      Output
                    </button>
                    <button onClick={() => setActiveGeneratorView('history')} className={`px-4 py-2 text-lg font-semibold transition-colors duration-200 ${activeGeneratorView === 'history' ? 'text-teal-400 border-b-2 border-teal-400' : 'text-slate-400 hover:text-slate-200'}`}>
                      History
                    </button>
                </div>
                {activeGeneratorView === 'output' && (
                    <OutputDisplay
                      isLoading={isGenerating}
                      error={generatorError}
                      content={generatedContent}
                      onRetry={handleGenerate}
                      title="Generated Content"
                    />
                )}
                {activeGeneratorView === 'history' && (
                    <HistoryPanel 
                      history={history}
                      onLoadItem={loadHistoryItem}
                      onClearHistory={clearHistory}
                    />
                )}
              </div>
            </div>
          </main>
        )}
        
        {activeMainView === 'auditor' && (
          <main className="mt-10 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16">
               <div className="flex flex-col">
                  <TextInput
                    id="audit_brand_voice_input"
                    label="1. Define Your Brand Voice"
                    placeholder="e.g., Our voice is simple, clean, and elegant. We use minimal words to make a big impact."
                    value={auditBrandVoice}
                    onChange={(e) => setAuditBrandVoice(e.target.value)}
                    rows={6}
                    disabled={isAuditing}
                  />
                  <div className="mt-10">
                    <TextInput
                      id="content_to_audit_input"
                      label="2. Paste Your Content to Audit"
                      placeholder="Paste the content you want to check against your brand voice here."
                      value={contentToAudit}
                      onChange={(e) => setContentToAudit(e.target.value)}
                      rows={10}
                      disabled={isAuditing}
                    />
                  </div>
                  <div className="mt-12">
                    <GenerateButton
                      onClick={handleAudit}
                      isLoading={isAuditing}
                      disabled={!auditBrandVoice || !contentToAudit}
                    >
                      Audit Content
                    </GenerateButton>
                  </div>
               </div>

               <div className="mt-12 lg:mt-0">
                  <OutputDisplay
                    isLoading={isAuditing}
                    error={auditError}
                    content={auditResult}
                    onRetry={handleAudit}
                    title="Audit Report"
                  />
               </div>
            </div>
          </main>
        )}

      </div>
    </div>
  );
};

export default App;