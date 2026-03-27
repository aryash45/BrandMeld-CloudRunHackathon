import React, { useState } from 'react';
import { BrandDNA } from '../services/apiService';

interface BrandKitCardProps {
  brandKit: BrandDNA;
}

const BrandKitCard: React.FC<BrandKitCardProps> = ({ brandKit }) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="neon-panel-soft px-5 py-5 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="neon-kicker">Decoded Profile</p>
          <h3 className="mt-3 font-display text-2xl font-semibold text-white">
            {brandKit.brand_name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Primary palette, typography, voice signature, and concepts to avoid.
          </p>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="neon-ghost-button rounded-full px-4 py-2 text-sm font-semibold"
        >
          {collapsed ? 'Expand kit' : 'Collapse kit'}
        </button>
      </div>

      {!collapsed && (
        <div className="mt-5 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[20px] border border-white/5 bg-slate-950/30 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Primary color
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span
                  className="h-10 w-10 rounded-2xl border border-white/10"
                  style={{ backgroundColor: brandKit.primary_hex }}
                />
                <span className="font-display text-lg font-semibold text-white">
                  {brandKit.primary_hex}
                </span>
              </div>
            </div>

            <div className="rounded-[20px] border border-white/5 bg-slate-950/30 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Typography
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {brandKit.typography.join(', ')}
              </p>
            </div>
          </div>

          <div className="rounded-[20px] border border-white/5 bg-slate-950/30 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Voice personality
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              {brandKit.voice_personality}
            </p>
          </div>

          <div className="rounded-[20px] border border-white/5 bg-slate-950/30 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Banned concepts
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {brandKit.banned_concepts.length === 0 ? (
                <span className="text-sm text-slate-400">No blocked concepts detected.</span>
              ) : (
                brandKit.banned_concepts.map((concept, index) => (
                  <span
                    key={`${concept}-${index}`}
                    className="rounded-full border border-rose-400/18 bg-rose-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-rose-200"
                  >
                    {concept}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandKitCard;
