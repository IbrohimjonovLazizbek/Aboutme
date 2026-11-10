import React, { useState } from 'react';

interface TopNavProps {
  brandWordmark: string;
  email: string;
  activeStage: 0 | 1 | 2 | 3;
  onSelectStage: (stageIndex: 0 | 1 | 2 | 3) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  brandWordmark,
  email,
  activeStage,
  onSelectStage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const navItems: { label: string; shortLabel: string; stage: 0 | 1 | 2 | 3 }[] = [
    { label: 'Identity', shortLabel: '01. Identity', stage: 0 },
    { label: 'Memory & Bio', shortLabel: '02. Memory & Bio', stage: 1 },
    { label: 'Focus & Works', shortLabel: '03. Focus & Works', stage: 2 },
    { label: 'Quiet Place', shortLabel: '04. Quiet Place', stage: 3 },
  ];

  const activeItem = navItems.find((item) => item.stage === activeStage) || navItems[0];

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

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#050505]/90 border-b border-white/[0.08]">
      <div className="flex items-center justify-between gap-3 sm:gap-6 px-4 sm:px-6 md:px-10 py-2.5 sm:py-3.5 max-w-[1440px] mx-auto">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#stage-top"
          onClick={(e) => {
            e.preventDefault();
            setMobileMenuOpen(false);
            onSelectStage(0);
          }}
          className="font-display text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
        >
          {brandWordmark}
        </a>

        {/* Zone 2: 4 clean single-line text navigation links on Tablet & Desktop */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-4 lg:gap-7 text-xs lg:text-sm font-medium text-zinc-400"
        >
          {navItems.map((item) => {
            const isCurrent = activeStage === item.stage;
            return (
              <a
                key={item.label}
                href={`#stage-${item.stage}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectStage(item.stage);
                }}
                className={`hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                  isCurrent ? 'text-white underline decoration-[#E2FF32]' : ''
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Primary action + Mobile Stage Drawer Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle mobile navigation menu"
            className="md:hidden px-2.5 py-1.5 text-xs font-medium text-zinc-200 bg-[#12121A] border border-white/15 rounded-lg hover:border-white/30 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {activeItem.label} {mobileMenuOpen ? '▴' : '▾'}
          </button>

          <button
            type="button"
            onClick={handleCopyEmail}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-[#050505] bg-[#E2FF32] rounded-lg hover:bg-[#d4f224] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {copiedEmail ? (
              '✓ Email Copied'
            ) : (
              <>
                <span className="hidden sm:inline">Get in Touch</span>
                <span className="sm:hidden">Contact</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer for Phones (< 768px) */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Stage Navigation"
          className="md:hidden px-4 pt-2 pb-3 bg-[#09090E] border-t border-white/10 grid grid-cols-2 gap-2"
        >
          {navItems.map((item) => {
            const isCurrent = activeStage === item.stage;
            return (
              <button
                key={item.stage}
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSelectStage(item.stage);
                }}
                className={`text-left px-3 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-white text-[#050505] border-white font-semibold'
                    : 'bg-[#12121A] text-zinc-300 border-white/10 hover:text-white'
                }`}
              >
                {item.shortLabel}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
};
