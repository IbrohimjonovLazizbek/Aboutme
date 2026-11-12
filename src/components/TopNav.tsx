import React, { useState } from 'react';
import { ParticleMorphMode, ScatterAnimationType } from '../utils/profileAndPrompt';

interface TopNavProps {
  brandWordmark: string;
  email: string;
  activeStage: 0 | 1 | 2 | 3;
  onSelectStage: (stageIndex: 0 | 1 | 2 | 3) => void;
  morphMode: ParticleMorphMode;
  scatterType?: ScatterAnimationType;
  onRandomize: () => void;
  statusText?: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  brandWordmark,
  email,
  activeStage,
  onSelectStage,
  morphMode,
  onRandomize,
  statusText,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const navItems: { label: string; shortLabel: string; stage: 0 | 1 | 2 | 3 }[] = [
    { label: 'Identity', shortLabel: 'Identity', stage: 0 },
    { label: 'Memory & Bio', shortLabel: 'Memory', stage: 1 },
    { label: 'Focus & Works', shortLabel: 'Works', stage: 2 },
    { label: 'Quiet Place', shortLabel: 'Quiet', stage: 3 },
  ];

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    }
  };

  const modeLabel = morphMode === 'architecture' ? 'VOXEL' : morphMode.toUpperCase();

  return (
    <header className="fixed top-2.5 sm:top-3.5 inset-x-0 z-50 flex justify-center px-2 sm:px-4 pointer-events-none">
      <nav
        aria-label="Compact Top Navigation"
        className="pointer-events-auto inline-flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-[#050505]/70 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.65)] text-xs max-w-full overflow-x-auto"
      >
        {/* Brand Wordmark */}
        <a
          href="#stage-top"
          onClick={(e) => {
            e.preventDefault();
            onSelectStage(0);
          }}
          className="font-display text-xs sm:text-sm font-bold tracking-tight text-white hover:text-[#E2FF32] transition-colors whitespace-nowrap shrink-0 pl-1"
        >
          {brandWordmark}
        </a>

        <span className="text-white/15 shrink-0 select-none" aria-hidden="true">|</span>

        {/* Compact Stage Navigation Text & Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {navItems.map((item) => {
            const isCurrent = activeStage === item.stage;
            return (
              <button
                key={item.stage}
                type="button"
                onClick={() => onSelectStage(item.stage)}
                className={`px-2 sm:px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs transition-all whitespace-nowrap cursor-pointer ${
                  isCurrent
                    ? 'bg-white text-[#050505] font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 font-medium'
                }`}
              >
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {statusText && (
          <span className="hidden lg:inline text-zinc-400 text-[11px] font-normal truncate max-w-[200px] shrink-0">
            · {statusText}
          </span>
        )}

        <span className="text-white/15 shrink-0 select-none" aria-hidden="true">|</span>

        {/* Compact 3D Mode Randomizer Button */}
        <button
          type="button"
          onClick={onRandomize}
          className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-medium text-[#E2FF32] bg-[#E2FF32]/10 hover:bg-[#E2FF32]/20 border border-[#E2FF32]/25 transition-all whitespace-nowrap cursor-pointer shrink-0"
          title="Click to randomize 3D particle morphology & scatter animation"
        >
          🎲 {modeLabel}
        </button>

        <span className="text-white/15 shrink-0 select-none" aria-hidden="true">|</span>

        {/* Compact Action Button */}
        <button
          type="button"
          onClick={handleCopyEmail}
          className="px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold text-[#050505] bg-[#E2FF32] rounded-full hover:bg-[#d4f224] transition-all whitespace-nowrap cursor-pointer shrink-0 shadow-sm"
        >
          {copiedEmail ? '✓ Copied' : 'Get in Touch'}
        </button>
      </nav>
    </header>
  );
};
