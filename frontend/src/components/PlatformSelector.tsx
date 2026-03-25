import React from 'react';
import { Platform, PLATFORM_META } from '../services/apiService';

interface PlatformSelectorProps {
  selectedPlatforms: Platform[];
  onChange: (platforms: Platform[]) => void;
  disabled?: boolean;
}

const ALL_PLATFORMS = Object.keys(PLATFORM_META) as Platform[];

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ selectedPlatforms, onChange, disabled }) => {
  const toggle = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      // Don't deselect if it's the last one
      if (selectedPlatforms.length === 1) return;
      onChange(selectedPlatforms.filter((p) => p !== platform));
    } else {
      onChange([...selectedPlatforms, platform]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">
        2. Publish To
      </label>
      <div className="flex flex-wrap gap-2">
        {ALL_PLATFORMS.map((platform) => {
          const meta = PLATFORM_META[platform];
          const isSelected = selectedPlatforms.includes(platform);
          return (
            <button
              key={platform}
              type="button"
              onClick={() => toggle(platform)}
              disabled={disabled}
              aria-pressed={isSelected}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold
                transition-all duration-200 select-none
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                ${isSelected
                  ? 'bg-teal-500/20 border-teal-500/60 text-teal-300 shadow-sm shadow-teal-900/30'
                  : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'}
              `}
            >
              <span className={`font-bold text-base leading-none ${isSelected ? meta.color : ''}`}>
                {meta.icon}
              </span>
              <span>{meta.label}</span>
              {isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
      {selectedPlatforms.length > 1 && (
        <p className="mt-2 text-xs text-slate-500">
          Generating {selectedPlatforms.length} tailored versions simultaneously.
        </p>
      )}
    </div>
  );
};

export default PlatformSelector;
