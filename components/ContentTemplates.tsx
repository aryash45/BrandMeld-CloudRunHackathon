import React from 'react';

interface ContentTemplatesProps {
  onTemplateSelect: (template: string) => void;
  disabled?: boolean;
}

const TwitterIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.073-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const BlogIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.573L16.5 21.75l-.398-1.177a3.375 3.375 0 00-2.456-2.456L12.5 17.25l1.177-.398a3.375 3.375 0 002.456-2.456L16.5 13.5l.398 1.177a3.375 3.375 0 002.456 2.456l1.177.398-1.177.398a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);


const TemplateButton: React.FC<{onClick: () => void, disabled?: boolean, children: React.ReactNode, icon: React.ReactNode}> = ({onClick, disabled, children, icon}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-700 hover:border-teal-500/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-teal-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
  >
    {icon}
    {children}
  </button>
);


const ContentTemplates: React.FC<ContentTemplatesProps> = ({ onTemplateSelect, disabled }) => {
  const templates = {
    tweet: 'Write a "Hot Take" tweet thread about... (Focus on a contrarian opinion)',
    instagram: 'Write a vulnerable/authentic "Behind the Scenes" caption about...',
    linkedin: 'Write a storytelling LinkedIn post using the "Hook-Story-Lesson" framework about...',
    newsletter: 'Outline a thought-leadership newsletter Deep Dive about...'
  };

  return (
    <div className="w-full">
      <label className="block text-lg font-semibold mb-3 text-slate-300">
        2. Select a Personal Brand Template
      </label>
      <div className="flex flex-wrap gap-3">
        <TemplateButton onClick={() => onTemplateSelect(templates.tweet)} disabled={disabled} icon={<TwitterIcon />}>
          Viral Thread
        </TemplateButton>
        <TemplateButton onClick={() => onTemplateSelect(templates.linkedin)} disabled={disabled} icon={<LinkedInIcon />}>
          Storytelling Post
        </TemplateButton>
         <TemplateButton onClick={() => onTemplateSelect(templates.instagram)} disabled={disabled} icon={<InstagramIcon />}>
          Authentic Caption
        </TemplateButton>
        <TemplateButton onClick={() => onTemplateSelect(templates.newsletter)} disabled={disabled} icon={<BlogIcon />}>
          Newsletter Deep Dive
        </TemplateButton>
      </div>
    </div>
  );
};

export default ContentTemplates;