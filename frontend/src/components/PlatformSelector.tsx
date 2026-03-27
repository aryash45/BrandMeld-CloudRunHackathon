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
      if (selectedPlatforms.length === 1) return;
      onChange(selectedPlatforms.filter((p) => p !== platform));
    } else {
      onChange([...selectedPlatforms, platform]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block font-display text-xl font-semibold tracking-tight text-white">
        Distribution Mix
      </label>
      <p className="text-sm leading-relaxed text-slate-400">
        Arm one or more channels and BrandMeld will tailor the same core idea for each
        destination.
      </p>
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
                neon-chip flex items-center gap-3 rounded-[18px] px-4 py-3 text-sm font-semibold
                transition-all duration-200 select-none
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                ${isSelected
                  ? 'is-active'
                  : ''}
              `}
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-slate-950/40 font-display text-xs font-bold uppercase leading-none ${isSelected ? meta.color : 'text-slate-400'}`}>
                {meta.icon}
              </span>
              <span>{meta.label}</span>
              {isSelected && (
                <span className="status-orb h-2 w-2" />
              )}
            </button>
          );
        })}
      </div>
      {selectedPlatforms.length > 1 && (
        <p className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 px-4 py-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
          Generating {selectedPlatforms.length} tailored versions simultaneously.
        </p>
      )}
    </div>
  );
};

export default PlatformSelector;
