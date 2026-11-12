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

        {/* Telegram Direct Contact Link */}
        <a
          href="https://t.me/Laz11zbek"
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold text-[#5bc0eb] bg-[#24A1DE]/15 hover:bg-[#24A1DE]/30 border border-[#24A1DE]/40 rounded-full transition-all whitespace-nowrap cursor-pointer shrink-0 shadow-sm flex items-center gap-1.5"
          title="Direct message on Telegram: @Laz11zbek"
        >
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
          </svg>
          <span>@Laz11zbek</span>
        </a>

        {/* Compact Email Action Button */}
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
