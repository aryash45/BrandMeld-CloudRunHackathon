
import React from 'react';

interface LandingPageProps {
  onLoginClick: () => void;
}

const FeatureCard: React.FC<{ title: string; desc: string; icon: React.ReactNode }> = ({ title, desc, icon }) => (
  <div className="group bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:bg-slate-800/80 hover:border-teal-500/30 transition-all duration-300">
    <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-6 text-teal-400 group-hover:scale-110 transition-transform duration-300 border border-slate-700">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-100 mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
  </div>
);

const UseCaseItem: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-3 text-slate-300">
    <svg className="w-5 h-5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
    <span>{label}</span>
  </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center relative overflow-x-hidden font-sans selection:bg-teal-500/30">
      
      {/* Abstract Background Shapes */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl w-full z-10 px-6 sm:px-8 lg:px-12 pb-20">
        
        {/* Navigation */}
        <nav className="flex justify-between items-center py-8 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg shadow-lg shadow-teal-500/20"></div>
            <span className="text-xl font-bold text-slate-100 tracking-tight">BrandMeld</span>
          </div>
          <button 
            onClick={onLoginClick}
            className="px-5 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors border border-slate-800 rounded-full hover:bg-slate-800"
          >
            Log In
          </button>
        </nav>

        {/* Hero Section */}
        <header className="text-center mt-16 sm:mt-24 mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/30 border border-teal-800/50 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-6">
            For Founders & Creators
          </div>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 mb-8 tracking-tight leading-tight">
            Scale Your <br className="hidden sm:block" />
            <span className="text-white">Personal Brand.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop sounding like a corporation. Generate authentic, high-impact content that mirrors your unique voice, opinions, and writing style.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onLoginClick}
              className="px-8 py-4 text-base font-bold text-white bg-teal-600 rounded-xl hover:bg-teal-500 transition-all duration-200 shadow-xl shadow-teal-900/20 w-full sm:w-auto hover:-translate-y-1"
            >
              Start Writing Free
            </button>
            <button
               onClick={onLoginClick}
               className="px-8 py-4 text-base font-bold text-slate-300 bg-slate-900 border border-slate-700 rounded-xl hover:bg-slate-800 transition-all duration-200 w-full sm:w-auto"
            >
              Analyze My Voice
            </button>
          </div>
        </header>

        {/* Social Proof Strip */}
        <div className="border-y border-slate-800/60 py-8 mb-24 flex flex-col items-center animate-fade-in delay-100">
           <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-6">Optimized for platforms</p>
           <div className="flex flex-wrap justify-center gap-8 sm:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {['LinkedIn', 'Twitter / X', 'Substack', 'Medium', 'Instagram'].map(platform => (
                <span key={platform} className="text-lg font-bold text-slate-300">{platform}</span>
              ))}
           </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-32">
          <FeatureCard 
            title="Voice Cloning" 
            desc="Paste your website, blog, or previous posts. Our AI deconstructs your syntax, tone, and vocabulary to build a custom model of YOU."
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
          <FeatureCard 
            title="Thought Leadership" 
            desc="Move beyond generic marketing copy. Generate 'hot takes', deep-dive threads, and storytelling posts that position you as an authority."
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
          <FeatureCard 
            title="Consistency Audit" 
            desc="Ensure every piece of content aligns with your personal brand. Get an instant score and actionable feedback before you hit publish."
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Deep Dive Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-6">Designed for the Modern Creator.</h2>
                <p className="text-slate-400 mb-8 text-lg">
                    Building a personal brand requires volume and quality. BrandMeld bridges the gap, allowing you to scale your output without losing your soul.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <UseCaseItem label="Founder Updates" />
                    <UseCaseItem label="Viral Twitter Threads" />
                    <UseCaseItem label="LinkedIn Storytelling" />
                    <UseCaseItem label="Newsletter Editions" />
                    <UseCaseItem label="Course Launches" />
                    <UseCaseItem label="Podcast Shownotes" />
                </div>
            </div>
            <div className="relative">
                 <div className="absolute inset-0 bg-teal-500/20 blur-3xl rounded-full"></div>
                 <div className="relative bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-2xl">
                    <div className="flex items-center gap-4 mb-4 border-b border-slate-800 pb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-700"></div>
                        <div>
                            <div className="h-3 w-24 bg-slate-700 rounded mb-2"></div>
                            <div className="h-2 w-16 bg-slate-800 rounded"></div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="h-2 w-full bg-slate-800 rounded"></div>
                        <div className="h-2 w-full bg-slate-800 rounded"></div>
                        <div className="h-2 w-3/4 bg-slate-800 rounded"></div>
                        <div className="h-20 w-full bg-teal-900/20 border border-teal-900/30 rounded flex items-center justify-center text-teal-500 text-sm font-mono">
                            > Generated in your voice...
                        </div>
                    </div>
                 </div>
            </div>
        </div>

        <footer className="text-center text-slate-600 text-sm border-t border-slate-800/50 pt-12">
          <p>© {new Date().getFullYear()} BrandMeld. Built for Personal Brands.</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
