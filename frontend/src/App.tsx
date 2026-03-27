import React, { useCallback, useEffect, useState } from 'react';
import {
  auditContent,
  batchGenerateContent,
  editContent,
  fetchBrandDNA,
  generateImage,
  type BrandDNA,
  type EditCommand,
  type Platform,
} from './services/apiService';
import AuthModal from './components/AuthModal';
import BatchOutputDisplay from './components/BatchOutputDisplay';
import BrandAnalyzer from './components/BrandAnalyzer';
import BrandKitCard from './components/BrandKitCard';
import ContentTemplates from './components/ContentTemplates';
import EditToolbar from './components/EditToolbar';
import GenerateButton from './components/GenerateButton';
import Header from './components/Header';
import HistoryPanel, { HistoryItem } from './components/HistoryPanel';
import ImagePreview from './components/ImagePreview';
import LandingPage from './components/LandingPage';
import OutputDisplay from './components/OutputDisplay';
import PlatformSelector from './components/PlatformSelector';
import TextInput from './components/TextInput';

type MainView = 'generator' | 'auditor';
type GeneratorOutputView = 'output' | 'history';

interface User {
  name: string;
  email: string;
}

interface MainTabButtonProps {
  view: MainView;
  label: string;
  description: string;
  activeView: MainView;
  onSelect: (view: MainView) => void;
}

interface GeneratorWorkspaceTabProps {
  view: GeneratorOutputView;
  label: string;
  activeView: GeneratorOutputView;
  onSelect: (view: GeneratorOutputView) => void;
}

interface DashboardStatCardProps {
  label: string;
  value: string;
  hint: string;
  accent?: 'cyan' | 'lime';
}

const MainTabButton: React.FC<MainTabButtonProps> = ({
  view,
  label,
  description,
  activeView,
  onSelect,
}) => (
  <button
    type="button"
    onClick={() => onSelect(view)}
    className={`neon-segment-button flex flex-1 flex-col items-start px-4 py-3 text-left sm:px-5 ${
      activeView === view ? 'is-active' : ''
    }`}
  >
    <span className="font-display text-sm font-semibold text-white sm:text-base">{label}</span>
    <span className="mt-1 text-xs leading-relaxed text-slate-400">{description}</span>
  </button>
);

const GeneratorWorkspaceTab: React.FC<GeneratorWorkspaceTabProps> = ({
  view,
  label,
  activeView,
  onSelect,
}) => (
  <button
    type="button"
    onClick={() => onSelect(view)}
    className={`neon-chip rounded-full px-4 py-2 text-sm font-semibold ${
      activeView === view ? 'is-active' : ''
    }`}
  >
    {label}
  </button>
);

const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  label,
  value,
  hint,
  accent = 'cyan',
}) => (
  <div className={`neon-stat-card px-5 py-5 sm:px-6 ${accent === 'lime' ? 'neon-stat-card--lime' : ''}`}>
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</p>
    <p className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">{value}</p>
    <p className="mt-3 text-sm leading-relaxed text-slate-400">{hint}</p>
  </div>
);

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const [activeMainView, setActiveMainView] = useState<MainView>('generator');

  const [brandVoice, setBrandVoice] = useState<string>('');
  const [contentRequest, setContentRequest] = useState<string>('');
  const [analyzeUrl, setAnalyzeUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeGeneratorView, setActiveGeneratorView] = useState<GeneratorOutputView>('output');

  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['twitter']);
  const [batchResults, setBatchResults] = useState<Partial<Record<Platform, string>>>({});
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatorError, setGeneratorError] = useState<string | null>(null);

  const [editHistory, setEditHistory] = useState<Partial<Record<Platform, string[]>>>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeEditCommand, setActiveEditCommand] = useState<EditCommand | null>(null);
  const [activeBatchTab, setActiveBatchTab] = useState<Platform | null>(null);

  const [auditBrandVoice, setAuditBrandVoice] = useState<string>('');
  const [contentToAudit, setContentToAudit] = useState<string>('');
  const [auditResult, setAuditResult] = useState<string>('');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditError, setAuditError] = useState<string | null>(null);

  const [brandKit, setBrandKit] = useState<BrandDNA | null>(null);

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('brandmeld_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setShowLanding(false);
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
    }

    try {
      const storedHistory = localStorage.getItem('brandmeld_history');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Failed to parse history from localStorage', error);
      localStorage.removeItem('brandmeld_history');
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('brandmeld_user', JSON.stringify(userData));
    setShowAuthModal(false);
    setShowLanding(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('brandmeld_user');
    setShowLanding(true);
    setBrandVoice('');
    setBatchResults({});
    setEditHistory({});
    setHistory([]);
    localStorage.removeItem('brandmeld_history');
  };

  const handleGenerate = useCallback(async () => {
    if (!brandVoice.trim() || !contentRequest.trim()) {
      setGeneratorError('Please fill in both brand voice and content request fields.');
      return;
    }

    setIsGenerating(true);
    setGeneratorError(null);
    setBatchResults({});
    setEditHistory({});
    setActiveGeneratorView('output');
    setActiveBatchTab(selectedPlatforms[0] ?? null);
    setGeneratedImage(null);
    setImageError(null);

    try {
      const results = await batchGenerateContent(brandVoice, contentRequest, selectedPlatforms);
      setBatchResults(results);

      const firstPlatform = selectedPlatforms[0];
      const firstContent = results[firstPlatform] ?? '';
      if (firstContent) {
        const newItem: HistoryItem = {
          brandVoice,
          contentRequest,
          generatedContent: firstContent,
          id: Date.now(),
        };
        const updatedHistory = [newItem, ...history].slice(0, 20);
        setHistory(updatedHistory);
        localStorage.setItem('brandmeld_history', JSON.stringify(updatedHistory));
      }
    } catch (error) {
      setGeneratorError(error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
      setIsGenerating(false);
    }
  }, [brandVoice, contentRequest, history, selectedPlatforms]);

  const availablePlatforms = selectedPlatforms.filter((platform) => batchResults[platform]);
  const activePlatform: Platform | null =
    availablePlatforms.length === 0
      ? null
      : activeBatchTab && availablePlatforms.includes(activeBatchTab)
        ? activeBatchTab
        : availablePlatforms[0];

  const handleEdit = useCallback(
    async (command: EditCommand) => {
      if (!activePlatform || !batchResults[activePlatform] || !brandVoice.trim()) return;

      setIsEditing(true);
      setActiveEditCommand(command);

      const originalContent = batchResults[activePlatform]!;

      setEditHistory((prev) => {
        const snapshots = prev[activePlatform] ?? [];
        return {
          ...prev,
          [activePlatform]: [...snapshots, originalContent],
        };
      });

      try {
        const edited = await editContent(originalContent, brandVoice, command);
        setBatchResults((prev) => ({ ...prev, [activePlatform]: edited }));
      } catch (error) {
        setEditHistory((prev) => {
          const snapshots = prev[activePlatform] ?? [];
          return { ...prev, [activePlatform]: snapshots.slice(0, -1) };
        });
      } finally {
        setIsEditing(false);
        setActiveEditCommand(null);
      }
    },
    [activePlatform, batchResults, brandVoice]
  );

  const handleGenerateImage = useCallback(async () => {
    if (!activePlatform || !brandKit) return;
    const content = batchResults[activePlatform];
    if (!content) return;

    setIsGeneratingImage(true);
    setGeneratedImage(null);
    setImageError(null);

    try {
      const imageUrl = await generateImage([brandKit.primary_hex], content, activePlatform);
      setGeneratedImage(imageUrl);
    } catch (error) {
      setGeneratedImage(null);
      setImageError(error instanceof Error ? error.message : 'Failed to generate image');
    } finally {
      setIsGeneratingImage(false);
    }
  }, [activePlatform, batchResults, brandKit]);

  const handleUndo = useCallback(() => {
    if (!activePlatform) return;
    const snapshots = editHistory[activePlatform] ?? [];
    if (snapshots.length === 0) return;

    const previous = snapshots[snapshots.length - 1];
    setBatchResults((prev) => ({ ...prev, [activePlatform]: previous }));
    setEditHistory((prev) => ({
      ...prev,
      [activePlatform]: snapshots.slice(0, -1),
    }));
  }, [activePlatform, editHistory]);

  const canUndo = (): boolean =>
    activePlatform ? (editHistory[activePlatform]?.length ?? 0) > 0 : false;

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
    } catch (error) {
      setAuditError(error instanceof Error ? error.message : 'An unknown error occurred.');
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
    setBrandVoice('');
    setBrandKit(null);

    try {
      const dna = await fetchBrandDNA(analyzeUrl);
      setBrandVoice(dna.voice_personality);
      setBrandKit(dna);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An unknown error occurred during analysis.';
      setBrandVoice(`Error: ${message}`);
    } finally {
      setIsAnalyzing(false);
    }
  }, [analyzeUrl]);

  const loadHistoryItem = (item: HistoryItem) => {
    setBrandVoice(item.brandVoice);
    setContentRequest(item.contentRequest);
    setSelectedPlatforms(['twitter']);
    setBatchResults({ twitter: item.generatedContent });
    setEditHistory({});
    setGeneratedImage(null);
    setImageError(null);
    setActiveBatchTab('twitter');
    setActiveMainView('generator');
    setActiveGeneratorView('output');
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('brandmeld_history');
  };

  const canGenerateImage = Boolean(brandKit && activePlatform);
  const isGenerateDisabled = !brandVoice.trim() || !contentRequest.trim() || isAnalyzing;
  const isAuditDisabled = !auditBrandVoice.trim() || !contentToAudit.trim();
  const generatorActionLabel =
    selectedPlatforms.length > 1
      ? `Generate for ${selectedPlatforms.length} Platforms`
      : 'Generate Draft';

  const dashboardStats = [
    {
      label: 'Platforms Armed',
      value: selectedPlatforms.length.toString().padStart(2, '0'),
      hint:
        selectedPlatforms.length > 1
          ? `${selectedPlatforms.length} channels primed for simultaneous output.`
          : 'Single-channel drafting mode is active.',
      accent: 'cyan' as const,
    },
    {
      label: 'Saved Sessions',
      value: history.length.toString().padStart(2, '0'),
      hint:
        history.length > 0
          ? 'Previous prompts are ready to reload from the archive.'
          : 'No stored sessions yet. Generate a draft to start the archive.',
      accent: 'lime' as const,
    },
    {
      label: 'Brand Kit',
      value: brandKit ? 'Ready' : 'Idle',
      hint: brandKit
        ? `Voice system extracted for ${brandKit.brand_name}.`
        : 'Run a brand scan to unlock palette and voice guidance.',
      accent: 'cyan' as const,
    },
    {
      label: 'Image Deck',
      value: generatedImage ? 'Ready' : canGenerateImage ? 'Primed' : 'Locked',
      hint: generatedImage
        ? 'A fresh visual is attached to the current content set.'
        : canGenerateImage
          ? 'Image generation is available for the active draft.'
          : 'Analyze a brand and generate content to enable visuals.',
      accent: 'lime' as const,
    },
  ];

  const activeModeCopy =
    activeMainView === 'generator'
      ? {
          title: 'Content Creator',
          description:
            'Build a voice profile, fan a concept across channels, and iterate on each draft without leaving the workspace.',
        }
      : {
          title: 'Voice Auditor',
          description:
            'Bring in an existing draft, compare it to your intended voice, and review the alignment report in one place.',
        };

  return (
    <div className="min-h-screen font-body text-slate-100">
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleLogin}
      />

      {showLanding ? (
        <LandingPage onLoginClick={() => setShowAuthModal(true)} />
      ) : (
        <div className="neon-dashboard">
          <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 xl:px-10">
            <div className="animate-fade-in">
              <Header user={user} onLogout={handleLogout} />

              <section className="neon-panel-soft mt-6 px-5 py-5 sm:px-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  <div className="max-w-3xl">
                    <p className="neon-kicker">Workspace Mode</p>
                    <h2 className="mt-3 font-display text-3xl font-semibold text-white">
                      {activeModeCopy.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
                      {activeModeCopy.description}
                    </p>
                  </div>
                  <div className="neon-segmented w-full sm:w-auto">
                    <MainTabButton
                      view="generator"
                      label="Content Creator"
                      description="Compose multi-platform drafts."
                      activeView={activeMainView}
                      onSelect={setActiveMainView}
                    />
                    <MainTabButton
                      view="auditor"
                      label="Voice Auditor"
                      description="Score voice alignment and polish."
                      activeView={activeMainView}
                      onSelect={setActiveMainView}
                    />
                  </div>
                </div>
              </section>

              <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {dashboardStats.map((stat) => (
                  <DashboardStatCard
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                    hint={stat.hint}
                    accent={stat.accent}
                  />
                ))}
              </section>

              {activeMainView === 'generator' && (
                <main className="dashboard-layout mt-6 animate-fade-in">
                  <section className="flex flex-col gap-4">
                    <div className="neon-panel px-5 py-5 sm:px-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="neon-kicker">Signal Intake</p>
                          <h2 className="mt-3 font-display text-2xl font-semibold text-white">
                            Brand scan
                          </h2>
                          <p className="mt-3 text-sm leading-relaxed text-slate-400">
                            Pull voice clues from a company or site, then convert them into
                            a reusable brand profile.
                          </p>
                        </div>
                        <span className="status-orb mt-2 shrink-0" />
                      </div>

                      <div className="mt-6">
                        <BrandAnalyzer
                          value={analyzeUrl}
                          onChange={(event) => setAnalyzeUrl(event.target.value)}
                          onAnalyze={handleAnalyze}
                          disabled={isGenerating}
                          isAnalyzing={isAnalyzing}
                        />
                      </div>

                      {brandKit && (
                        <div className="mt-5">
                          <BrandKitCard brandKit={brandKit} />
                        </div>
                      )}
                    </div>

                    <div className="neon-panel px-5 py-5 sm:px-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="neon-kicker">Visual Relay</p>
                          <h2 className="mt-3 font-display text-2xl font-semibold text-white">
                            Image deck
                          </h2>
                          <p className="mt-3 text-sm leading-relaxed text-slate-400">
                            Generate a companion visual using the active draft and the scanned
                            brand palette.
                          </p>
                        </div>
                        <span className="rounded-full border border-cyan-400/10 bg-cyan-400/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          {canGenerateImage ? 'Ready' : 'Locked'}
                        </span>
                      </div>

                      {brandKit ? (
                        <div className="mt-6">
                          <GenerateButton
                            onClick={handleGenerateImage}
                            isLoading={isGeneratingImage}
                            disabled={!canGenerateImage}
                          >
                            Generate Image
                          </GenerateButton>
                        </div>
                      ) : (
                        <div className="mt-6 rounded-[22px] border border-white/5 bg-slate-950/30 px-4 py-4 text-sm leading-relaxed text-slate-500">
                          Run a brand scan first to unlock visual generation.
                        </div>
                      )}

                      {generatedImage && (
                        <div className="mt-5">
                          <ImagePreview imageDataUrl={generatedImage} />
                        </div>
                      )}

                      {imageError && (
                        <p className="mt-4 text-sm leading-relaxed text-rose-300">{imageError}</p>
                      )}
                    </div>
                  </section>

                  <section>
                    <div className="neon-panel px-5 py-5 sm:px-7 sm:py-6">
                      <div className="flex flex-col gap-4 border-b border-white/5 pb-6 sm:flex-row sm:items-start sm:justify-between">
                        <div className="max-w-2xl">
                          <p className="neon-kicker">Composition Deck</p>
                          <h2 className="mt-3 font-display text-3xl font-semibold text-white">
                            Compose in your voice
                          </h2>
                          <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
                            Build the voice blueprint, choose your channels, and ship a prompt
                            package that feels unmistakably human.
                          </p>
                        </div>
                        <div className="rounded-full border border-lime-300/12 bg-lime-300/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          {selectedPlatforms.length} live channel{selectedPlatforms.length === 1 ? '' : 's'}
                        </div>
                      </div>

                      <div className="mt-6 space-y-6">
                        <TextInput
                          id="brand_voice_input"
                          label="Voice Blueprint"
                          placeholder="e.g., Casual but authoritative. I use short sentences. I hate jargon. I sound like a smart friend giving advice."
                          value={brandVoice}
                          onChange={(event) => setBrandVoice(event.target.value)}
                          rows={6}
                          disabled={isGenerating || isAnalyzing}
                        />

                        <PlatformSelector
                          selectedPlatforms={selectedPlatforms}
                          onChange={setSelectedPlatforms}
                          disabled={isGenerating}
                        />

                        <ContentTemplates
                          onTemplateSelect={handleTemplateSelect}
                          disabled={isGenerating}
                        />

                        <TextInput
                          id="content_request_input"
                          label="Campaign Brief"
                          placeholder="e.g., A thread about why most startups fail..."
                          value={contentRequest}
                          onChange={(event) => setContentRequest(event.target.value)}
                          rows={7}
                          disabled={isGenerating}
                        />

                        <GenerateButton
                          onClick={handleGenerate}
                          isLoading={isGenerating}
                          disabled={isGenerateDisabled}
                        >
                          {generatorActionLabel}
                        </GenerateButton>
                      </div>
                    </div>
                  </section>

                  <section className="output-stack">
                    <div className="neon-panel px-5 py-5 sm:px-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="neon-kicker">Output Relay</p>
                          <h2 className="mt-3 font-display text-2xl font-semibold text-white">
                            Draft monitor
                          </h2>
                          <p className="mt-3 text-sm leading-relaxed text-slate-400">
                            Track live output, switch across channels, and revisit prior sessions.
                          </p>
                        </div>
                        <div className="neon-segmented">
                          <GeneratorWorkspaceTab
                            view="output"
                            label="Generated Drafts"
                            activeView={activeGeneratorView}
                            onSelect={setActiveGeneratorView}
                          />
                          <GeneratorWorkspaceTab
                            view="history"
                            label="History"
                            activeView={activeGeneratorView}
                            onSelect={setActiveGeneratorView}
                          />
                        </div>
                      </div>
                    </div>

                    {activeGeneratorView === 'output' ? (
                      <>
                        <BatchOutputDisplay
                          isLoading={isGenerating}
                          error={generatorError}
                          results={batchResults}
                          selectedPlatforms={selectedPlatforms}
                          activeTab={activeBatchTab}
                          onTabChange={setActiveBatchTab}
                          onRetry={handleGenerate}
                        />

                        {Object.keys(batchResults).length > 0 && (
                          <EditToolbar
                            isEditing={isEditing}
                            activeCommand={activeEditCommand}
                            onEdit={handleEdit}
                            onUndo={handleUndo}
                            canUndo={canUndo()}
                            disabled={isGenerating}
                          />
                        )}
                      </>
                    ) : (
                      <HistoryPanel
                        history={history}
                        onLoadItem={loadHistoryItem}
                        onClearHistory={clearHistory}
                      />
                    )}
                  </section>
                </main>
              )}

              {activeMainView === 'auditor' && (
                <main className="auditor-layout mt-6 animate-fade-in">
                  <section className="neon-panel px-5 py-5 sm:px-7 sm:py-6">
                    <div className="rounded-[24px] border border-white/5 bg-slate-950/30 px-5 py-5">
                      <p className="neon-kicker">Audit Intake</p>
                      <h2 className="mt-3 font-display text-3xl font-semibold text-white">
                        Voice alignment check
                      </h2>
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
                        Paste the reference voice and the draft you want to inspect. BrandMeld
                        will score the fit and call out where the copy drifts into generic AI tone.
                      </p>
                    </div>

                    <div className="mt-6 space-y-6">
                      <TextInput
                        id="audit_brand_voice_input"
                        label="Reference Voice"
                        placeholder="e.g., Direct, no fluff, contrarian. I use simple words and avoid emojis."
                        value={auditBrandVoice}
                        onChange={(event) => setAuditBrandVoice(event.target.value)}
                        rows={6}
                        disabled={isAuditing}
                      />

                      <TextInput
                        id="content_to_audit_input"
                        label="Draft To Audit"
                        placeholder="Paste the LinkedIn post or X thread you want to check..."
                        value={contentToAudit}
                        onChange={(event) => setContentToAudit(event.target.value)}
                        rows={10}
                        disabled={isAuditing}
                      />

                      <GenerateButton
                        onClick={handleAudit}
                        isLoading={isAuditing}
                        disabled={isAuditDisabled}
                      >
                        Audit Content
                      </GenerateButton>
                    </div>
                  </section>

                  <section className="output-stack">
                    <div className="neon-panel px-5 py-5 sm:px-6">
                      <p className="neon-kicker">Report Stream</p>
                      <h2 className="mt-3 font-display text-2xl font-semibold text-white">
                        Alignment report
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-slate-400">
                        Review fit, tone drift, and suggested rewrites without leaving the dashboard.
                      </p>
                    </div>

                    <OutputDisplay
                      isLoading={isAuditing}
                      error={auditError}
                      content={auditResult}
                      onRetry={handleAudit}
                      title="Audit Report"
                    />
                  </section>
                </main>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
