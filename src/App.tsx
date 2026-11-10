import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  computeScrollCameraPose,
  DEFAULT_LAZIZXON_PROFILE,
  LightingPaletteId,
  ParticleMorphMode,
  PersonalProfile,
  pickRandomParticlePreset,
  ProjectItem,
  ScatterAnimationType,
  SCATTER_ANIMATION_LABELS,
} from './utils/profileAndPrompt';
import { TopNav } from './components/TopNav';
import { ParticleSelfCanvas } from './components/ParticleSelfCanvas';
import { BottomControlDock } from './components/BottomControlDock';
import { ProjectModal } from './components/ProjectModal';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

// 40 vertical ticks for the "Golden time" bar matrix matching ref-frame-2.png
const GOLDEN_TIME_TICKS = Array.from({ length: 40 }, (_, i) =>
  i >= 29 && i <= 36 ? 'lime' : i % 5 === 0 ? 'dim' : 'purple'
);

export default function App() {
  const prefersReducedMotion = useReducedMotion();
  const [profile] = useState<PersonalProfile>(DEFAULT_LAZIZXON_PROFILE);

  // Pick a fresh random Bust / Neural / Voxel / Wave morphology & Scatter animation type every time!
  const [initialRandom] = useState(() => pickRandomParticlePreset());
  const [morphMode, setMorphMode] = useState<ParticleMorphMode>(initialRandom.morphMode);
  const [scatterType, setScatterType] = useState<ScatterAnimationType>(
    initialRandom.scatterType
  );
  const [dispersion, setDispersion] = useState<number>(initialRandom.dispersion);
  const [seed, setSeed] = useState<number>(initialRandom.seed);

  const [paletteId, setPaletteId] = useState<LightingPaletteId>('ivory-indigo');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [selectedExpIndex, setSelectedExpIndex] = useState<number>(0);
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [viewportSize, setViewportSize] = useState<{ w: number; h: number }>(() => ({
    w: typeof window !== 'undefined' ? window.innerWidth : 1440,
    h: typeof window !== 'undefined' ? window.innerHeight : 900,
  }));

  const randomizeParticleState = useCallback(() => {
    const next = pickRandomParticlePreset(morphMode, scatterType);
    setMorphMode(next.morphMode);
    setScatterType(next.scatterType);
    setDispersion(next.dispersion);
    setSeed(next.seed);
  }, [morphMode, scatterType]);

  useEffect(() => {
    const onResize = () => {
      setViewportSize({
        w: window.innerWidth,
        h: window.innerHeight,
      });
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Sync window scroll inside the 420vh stage container with scrollProgress [0..1]
  useEffect(() => {
    const handleScroll = () => {
      const stageEl = document.getElementById('particle-self-stage-track');
      if (!stageEl) return;
      const rect = stageEl.getBoundingClientRect();
      const scrollableDistance = Math.max(1, stageEl.offsetHeight - window.innerHeight);
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, Math.max(0, scrolled / scrollableDistance));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Optional Cinema Auto-Play loop that smoothly sweeps through all 4 stages on the main head
  useEffect(() => {
    if (!isAutoPlaying) return;
    let rafId = 0;
    let lastTime = performance.now();

    const step = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      setScrollProgress((prev) => {
        const next = prev + dt * 0.085;
        return next > 1 ? 0 : next;
      });
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isAutoPlaying]);

  const jumpToStage = (stage: 0 | 1 | 2 | 3) => {
    setIsAutoPlaying(false);
    const targetProgressMap: Record<0 | 1 | 2 | 3, number> = {
      0: 0.04,
      1: 0.38,
      2: 0.64,
      3: 0.94,
    };
    const targetP = targetProgressMap[stage];
    setScrollProgress(targetP);

    const stageEl = document.getElementById('particle-self-stage-track');
    if (stageEl) {
      const scrollableDistance = Math.max(1, stageEl.offsetHeight - window.innerHeight);
      window.scrollTo({
        top: stageEl.offsetTop + targetP * scrollableDistance,
        behavior: 'instant' as ScrollBehavior,
      });
    }
  };

  const viewportAspect = viewportSize.w / Math.max(1, viewportSize.h);
  const pose = computeScrollCameraPose(scrollProgress, viewportAspect);
  const { activeStage, monolithFrameProgress } = pose;

  // Automatically pick a random Bust / Neural / Voxel / Wave & Scatter animation each time the user enters a new stage
  const prevStageRef = useRef<number>(activeStage);
  useEffect(() => {
    if (prevStageRef.current !== activeStage) {
      prevStageRef.current = activeStage;
      const next = pickRandomParticlePreset(morphMode, scatterType);
      setMorphMode(next.morphMode);
      setScatterType(next.scatterType);
      setDispersion(next.dispersion);
      setSeed(next.seed);
    }
  }, [activeStage, morphMode, scatterType]);

  const activeExperience =
    profile.experience[selectedExpIndex] || profile.experience[0];

  const fadeUpInitial = prefersReducedMotion
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: 20 };

  // Dynamic outer frame styling for Stage 3 ("Everything around you, in one quiet place" monolith window)
  const maxFramePad = viewportSize.w < 640 ? 12 : viewportSize.w < 1024 ? 22 : 44;
  const maxFrameRadius = viewportSize.w < 640 ? 18 : viewportSize.w < 1024 ? 24 : 28;
  const framePaddingPx = Math.round(monolithFrameProgress * maxFramePad);
  const frameRadiusPx = Math.round(monolithFrameProgress * maxFrameRadius);

  return (
    <div
      id="stage-top"
      data-active-stage={activeStage}
      data-morph-mode={morphMode}
      data-scatter-type={scatterType}
      data-palette={paletteId}
      className="min-h-screen bg-[#050505] text-[#F4F4F6] selection:bg-[#E2FF32] selection:text-[#050505] overflow-x-clip"
    >
      {/* 3-Zone Top Bar Contract */}
      <TopNav
        brandWordmark={profile.brandWordmark}
        email={profile.email}
        activeStage={activeStage}
        onSelectStage={jumpToStage}
      />

      <main>
        {/* 420VH SCROLL-PINNED MAIN PAGE HEAD STAGE */}
        <div
          id="particle-self-stage-track"
          className="relative w-full h-[420vh]"
        >
          {/* Sticky Full-Viewport Container where ALL 4 Stages animate on the 3D Particle Head */}
          <div
            className="sticky top-0 w-full h-screen h-[100dvh] overflow-hidden flex items-center justify-center transition-colors duration-300"
            style={{
              backgroundColor:
                monolithFrameProgress > 0.05
                  ? `rgb(${Math.round(5 + monolithFrameProgress * 160)}, ${Math.round(
                      5 + monolithFrameProgress * 160
                    )}, ${Math.round(5 + monolithFrameProgress * 168)})`
                  : '#050505',
              padding: `${framePaddingPx}px`,
            }}
          >
            {/* Inner Monolith Screen Container */}
            <div
              className="relative w-full h-full overflow-hidden bg-[#050505] flex flex-col justify-between shadow-2xl"
              style={{
                borderRadius: `${frameRadiusPx}px`,
                border:
                  monolithFrameProgress > 0.1
                    ? '1px solid rgba(255,255,255,0.14)'
                    : 'none',
              }}
            >
              {/* Layer 0: Subtle volumetric backlight glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(165, 180, 252, 0.20) 0%, rgba(255, 248, 225, 0.08) 30%, rgba(5, 5, 5, 0) 65%)',
                }}
              />

              {/* Layer 1 (z-25): Top-Pinned Giant Hybrid Sans + Pixel Typography ABOVE the Lowered 3D Fluid Bust (100% Visible in Stage 0) */}
              <AnimatePresence>
                {activeStage === 0 && (
                  <motion.div
                    key="stage0-giant-headline"
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
                    className="pointer-events-none absolute inset-x-0 top-[13%] sm:top-[13.5%] md:top-[14%] z-[25] flex items-center justify-center px-3 sm:px-6 overflow-hidden"
                  >
                    <h1
                      aria-label={`${profile.heroGreetingPrefix} ${profile.heroPixelWord} ${profile.heroDisplayName}`}
                      className="w-full text-center font-display font-medium tracking-[-0.03em] text-white/95 drop-shadow-[0_4px_24px_rgba(5,5,5,0.92)] text-[clamp(1.65rem,7.2vw,7.5rem)] leading-[1.05] select-none flex flex-wrap sm:flex-nowrap items-baseline justify-center sm:justify-between gap-x-2 sm:gap-x-0 max-w-[1380px] mx-auto"
                    >
                      <span>{profile.heroGreetingPrefix}</span>
                      <span className="font-pixel text-[0.82em] tracking-tighter text-[#E2FF32] sm:text-zinc-100 mx-1.5 sm:mx-3 md:mx-6">
                        {profile.heroPixelWord}
                      </span>
                      <span>{profile.heroDisplayName}</span>
                    </h1>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Layer 2 (z-20): Interactive 3D Particle Self WebGL Canvas */}
              <div className="absolute inset-0 z-20">
                <ParticleSelfCanvas
                  morphMode={morphMode}
                  scatterType={scatterType}
                  paletteId={paletteId}
                  dispersion={dispersion}
                  seed={seed}
                  scrollProgress={scrollProgress}
                />
              </div>

              {/* Layer 3 (z-30): Stage-Driven Spatial HUD Overlays Appearing Around the 3D Head */}
              <div className="relative z-30 w-full h-full pointer-events-none flex flex-col justify-between pt-14 sm:pt-16 md:pt-16 pb-24 sm:pb-32 lg:pb-28 px-3.5 sm:px-6 md:px-12 max-w-[1440px] mx-auto">
                {/* Top-Center Subtle OS Telemetry Bar (Matches reference video top bar) */}
                <div className="w-full flex items-center justify-center">
                  <div className="pointer-events-auto inline-flex items-center gap-2.5 sm:gap-4 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#121218]/90 border border-white/10 text-[11px] sm:text-xs text-zinc-300 shadow-lg max-w-full overflow-x-auto">
                    <button
                      type="button"
                      onClick={randomizeParticleState}
                      className="font-mono-code text-[#E2FF32] hover:underline underline-offset-2 shrink-0 cursor-pointer"
                      title="Click to randomize 3D morph & scatter animation"
                    >
                      🎲 {morphMode === 'architecture' ? 'VOXEL' : morphMode.toUpperCase()} ·{' '}
                      {SCATTER_ANIMATION_LABELS[scatterType]}
                    </button>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-white whitespace-nowrap shrink-0">
                      {profile.statusListeningText}
                    </span>
                    <span className="hidden sm:inline text-zinc-600" aria-hidden="true">
                      |
                    </span>
                    <div className="hidden sm:flex items-center gap-3 text-zinc-400 shrink-0">
                      <button
                        type="button"
                        onClick={() => jumpToStage(0)}
                        className={`hover:text-white transition-colors cursor-pointer ${
                          activeStage === 0 ? 'text-white font-medium' : ''
                        }`}
                      >
                        Status
                      </button>
                      <button
                        type="button"
                        onClick={() => jumpToStage(1)}
                        className={`hover:text-white transition-colors cursor-pointer ${
                          activeStage === 1 ? 'text-white font-medium' : ''
                        }`}
                      >
                        Memory
                      </button>
                      <button
                        type="button"
                        onClick={() => jumpToStage(2)}
                        className={`hover:text-white transition-colors cursor-pointer ${
                          activeStage === 2 ? 'text-white font-medium' : ''
                        }`}
                      >
                        Focus & Works
                      </button>
                      <button
                        type="button"
                        onClick={() => jumpToStage(3)}
                        className={`hover:text-white transition-colors cursor-pointer ${
                          activeStage === 3 ? 'text-white font-medium' : ''
                        }`}
                      >
                        Monolith
                      </button>
                    </div>
                  </div>
                </div>

                {/* MIDDLE / LOWER STAGE CONTENT OVERLAYS */}
                <div className="mt-auto lg:my-auto w-full">
                  <AnimatePresence mode="wait">
                    {/* STAGE 0: Bottom-Left Hero Manifesto (Matches vid-t4.png) */}
                    {activeStage === 0 && (
                      <motion.div
                        key="stage-0-overlay"
                        initial={fadeUpInitial}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                        className="w-full flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-6 pt-[26vh] sm:pt-[34vh]"
                      >
                        <div className="pointer-events-auto max-w-sm space-y-1.5 sm:space-y-2.5 bg-[#08080D]/88 p-3.5 sm:p-4 rounded-xl border border-white/10 shadow-xl">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-zinc-400">
                            <span className="font-medium text-zinc-200">
                              {profile.versionTag}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{profile.systemSubtitle}</span>
                          </div>

                          <p className="font-display text-base sm:text-lg md:text-xl font-medium text-white leading-snug">
                            <span className="block">{profile.heroStatementLine1}</span>
                            <span className="block">{profile.heroStatementLine2}</span>
                            <span className="block text-zinc-400">
                              {profile.heroStatementLine3}
                            </span>
                          </p>
                        </div>

                        <div className="pointer-events-auto flex flex-wrap items-center gap-2 sm:gap-2.5">
                          <button
                            type="button"
                            onClick={() => jumpToStage(1)}
                            className="px-3 sm:px-3.5 py-2 text-xs font-medium text-zinc-200 bg-[#0D0D12]/95 hover:bg-[#16161F] border border-white/15 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            Next Stage: Macro Memory ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => jumpToStage(2)}
                            className="px-3 sm:px-3.5 py-2 text-xs font-semibold text-[#050505] bg-[#E2FF32] hover:bg-[#d4f224] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            Selected Works →
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* STAGE 1 (02. Macro Memory): Macro Voxel Face on Left/Top + Lazizbek CV & 2023-2025-2026 Education Roadmap on Right/Bottom */}
                    {activeStage === 1 && (
                      <motion.div
                        key="stage-1-overlay"
                        initial={fadeUpInitial}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
                        className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-end lg:items-center pt-[20vh] sm:pt-[22vh] lg:pt-0"
                      >
                        {/* Left 6 cols kept unobstructed on desktop for the Macro 3D Voxel Face */}
                        <div className="hidden lg:block lg:col-span-6" />

                        {/* Right 6 cols: Lazizbek CV Profile & 2023 -> 2025 -> 2026 Education Roadmap Card */}
                        <div className="lg:col-span-6 pointer-events-auto space-y-3 sm:space-y-4 bg-[#0A0A0E]/92 border border-white/12 rounded-2xl p-4 sm:p-6 md:p-7 shadow-2xl max-h-[56dvh] lg:max-h-none overflow-y-auto">
                          <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-zinc-400">
                            <span className="font-medium text-[#E2FF32]">
                              {profile.memoryStageBadge}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{profile.location}</span>
                          </div>

                          <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
                            {profile.memoryStageHeadline}
                          </h2>

                          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                            {profile.aboutLead}
                          </p>

                          {/* 3-Step Education Roadmap (2023 Fergana -> 2025 Int'l House Tashkent -> 2026 INHA University) */}
                          <div className="pt-2.5 sm:pt-3 border-t border-white/10 space-y-2">
                            <p className="font-mono-code text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-400">
                              Education & Academic Roadmap (Click milestone for details)
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {profile.projects.map((item) => (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => setActiveProject(item)}
                                  className="text-left p-2.5 rounded-xl bg-[#12121A] hover:bg-[#191924] border border-white/10 transition-colors cursor-pointer"
                                >
                                  <div className="flex items-center justify-between text-[10px] font-mono-code text-[#E2FF32]">
                                    <span>{item.year}</span>
                                    <span className="text-zinc-400">Milestone</span>
                                  </div>
                                  <p className="font-display text-xs sm:text-sm font-bold text-white mt-0.5 leading-snug">
                                    {item.title}
                                  </p>
                                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">
                                    {item.summary}
                                  </p>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 4 Programming Languages Summary Strip */}
                          <div className="pt-2.5 sm:pt-3 border-t border-white/10">
                            <div className="flex flex-wrap items-center gap-y-1 text-[11px] sm:text-xs text-zinc-300">
                              {profile.disciplines.map((disc, idx) => (
                                <React.Fragment key={disc}>
                                  <span
                                    className={
                                      disc.includes('C++')
                                        ? 'text-[#E2FF32] font-medium'
                                        : ''
                                    }
                                  >
                                    {disc}
                                  </span>
                                  {idx < profile.disciplines.length - 1 && (
                                    <span
                                      aria-hidden="true"
                                      className="mx-2 text-zinc-600"
                                    >
                                      ·
                                    </span>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div className="pt-1.5 sm:pt-2 flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[11px] sm:text-xs text-zinc-400">
                              {profile.fullName} · {profile.roleTitle}
                            </span>
                            <button
                              type="button"
                              onClick={() => jumpToStage(2)}
                              className="px-3 py-1.5 text-xs font-semibold text-[#050505] bg-[#E2FF32] rounded-lg hover:bg-[#d4f224] transition-colors cursor-pointer shrink-0"
                            >
                              03. Focus & 4 Languages →
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STAGE 2 (03. Focus & Works): Macro Voxel Face on Right/Top + Left/Bottom Roadmap Timeline & 4 Programming Languages Cards */}
                    {activeStage === 2 && (
                      <motion.div
                        key="stage-2-overlay"
                        initial={fadeUpInitial}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
                        className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-end lg:items-center pt-[16vh] sm:pt-[20vh] lg:pt-0"
                      >
                        {/* Left 6 cols on Desktop, 2-col side-by-side on Tablet, compact stack on Phone */}
                        <div className="lg:col-span-6 pointer-events-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 w-full lg:max-w-xl max-h-[58dvh] lg:max-h-none overflow-y-auto">
                          {/* Card 1: Education Roadmap Progression Chart (2023 Fergana -> 2025 IHT -> 2026 INHA) */}
                          <div className="bg-[#0D0D12]/95 border border-white/12 rounded-2xl p-3.5 sm:p-5 shadow-2xl space-y-2.5 sm:space-y-3.5">
                            {/* Vertical Bar Chart */}
                            <div className="h-14 sm:h-20 flex items-end justify-between gap-2 sm:gap-3 pt-1 px-1 sm:px-2 border-b border-white/10 pb-1.5">
                              {profile.activityBars.map((bar) => (
                                <div
                                  key={bar.timeLabel}
                                  className="flex-1 flex flex-col items-center gap-1 h-full justify-end"
                                >
                                  <div className="w-full flex items-end justify-center gap-1 h-10 sm:h-14">
                                    <div
                                      className="w-2 sm:w-2.5 rounded-t-sm bg-[#A78BFA]"
                                      style={{ height: `${bar.purpleHeight}%` }}
                                    />
                                    {bar.limeHeight > 0 && (
                                      <div
                                        className="w-1.5 sm:w-2 rounded-t-sm bg-[#E2FF32]"
                                        style={{ height: `${bar.limeHeight}%` }}
                                      />
                                    )}
                                  </div>
                                  <span className="font-mono-code text-[9px] sm:text-[10px] text-zinc-400 tabular-nums">
                                    {bar.timeLabel}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center justify-between text-[11px] sm:text-xs text-zinc-300 font-medium">
                              <span>{profile.weeklyHandledSummary}</span>
                            </div>

                            {/* Interactive Education Roadmap Switcher (2023, 2025, 2026) */}
                            <div className="pt-1.5 border-t border-white/10 space-y-1.5 sm:space-y-2">
                              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                                {profile.experience.map((exp, idx) => (
                                  <button
                                    key={exp.id}
                                    type="button"
                                    onClick={() => setSelectedExpIndex(idx)}
                                    className={`px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                                      selectedExpIndex === idx
                                        ? 'bg-[#E2FF32] text-[#050505] font-semibold'
                                        : 'bg-white/5 text-zinc-300 hover:text-white'
                                    }`}
                                  >
                                    {exp.index} · {exp.organization}
                                  </button>
                                ))}
                              </div>
                              {activeExperience && (
                                <div className="text-[11px] sm:text-xs space-y-0.5">
                                  <p className="font-semibold text-white">
                                    {activeExperience.role} ·{' '}
                                    <span className="font-mono-code text-[#E2FF32]">
                                      {activeExperience.period}
                                    </span>
                                  </p>
                                  <p className="text-zinc-300 leading-relaxed">
                                    {activeExperience.impact}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Card 2: 4 Programming Languages (JavaScript, Python, Full-Stack & C++ in Process of Learning) */}
                          <div className="bg-[#0D0D12]/95 border border-white/12 rounded-2xl p-3.5 sm:p-5 shadow-2xl space-y-2.5 sm:space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs sm:text-sm font-semibold text-white">
                                {profile.goldenTimeTitle}
                              </span>
                              <span className="text-[11px] sm:text-xs font-mono-code text-[#E2FF32]">
                                {profile.goldenTimeBadge}
                              </span>
                            </div>

                            {/* 4 Programming Languages Breakdown Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                              {profile.programmingLanguages.map((lang) => (
                                <div
                                  key={lang.id}
                                  className={`p-2.5 rounded-xl border ${
                                    lang.isLearning
                                      ? 'bg-[#17190E] border-[#E2FF32]/40'
                                      : 'bg-[#14141D] border-white/10'
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="font-display text-xs sm:text-sm font-bold text-white">
                                      {lang.index}. {lang.name}
                                    </span>
                                    <span
                                      className={`font-mono-code text-[10px] ${
                                        lang.isLearning
                                          ? 'text-[#E2FF32] font-semibold'
                                          : 'text-zinc-300'
                                      }`}
                                    >
                                      {lang.status}
                                    </span>
                                  </div>
                                  <p className="text-[10px] sm:text-[11px] text-zinc-400 mt-1 leading-snug">
                                    {lang.detail}
                                  </p>
                                </div>
                              ))}
                            </div>

                            {/* 40-bar Purple & Lime Vertical Tick Matrix */}
                            <div
                              aria-hidden="true"
                              className="flex items-center justify-between gap-[2px] sm:gap-[3px] h-3.5 sm:h-4 py-0.5 overflow-hidden"
                            >
                              {GOLDEN_TIME_TICKS.map((kind, i) => (
                                <span
                                  key={i}
                                  className={`w-[2px] sm:w-[3px] h-full rounded-full ${
                                    kind === 'lime'
                                      ? 'bg-[#E2FF32]'
                                      : kind === 'purple'
                                      ? 'bg-[#A78BFA]/75'
                                      : 'bg-zinc-700'
                                  }`}
                                />
                              ))}
                            </div>

                            <div className="flex items-center justify-between gap-2 pt-0.5">
                              <p className="text-[10px] sm:text-[11px] text-zinc-400">
                                {profile.goldenTimeFootnote}
                              </p>
                              <button
                                type="button"
                                onClick={() => jumpToStage(3)}
                                className="px-2.5 py-1 text-[11px] font-semibold text-[#050505] bg-[#E2FF32] rounded-md hover:bg-[#d4f224] transition-colors cursor-pointer shrink-0"
                              >
                                04. Quiet Monolith →
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Right 6 cols kept unobstructed on desktop for the Macro 3D Voxel Face */}
                        <div className="hidden lg:block lg:col-span-6" />
                      </motion.div>
                    )}

                    {/* STAGE 3 (04. Quiet Monolith): Full CV Roadmap (2023 Fergana, 2025 Int'l House, 2026 INHA) + 4 Programming Languages Showcase */}
                    {activeStage === 3 && (
                      <motion.div
                        key="stage-3-overlay"
                        initial={fadeUpInitial}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
                        className="w-full flex flex-col items-center justify-between h-[64dvh] sm:h-[68vh] mb-8 sm:mb-10"
                      >
                        {/* Top-Center Headline Above the 3D Particle Bust */}
                        <div className="pointer-events-auto text-center space-y-1 sm:space-y-1.5 mt-1 px-4 sm:px-7 py-2.5 sm:py-3.5 rounded-2xl bg-[#050508]/90 border border-white/12 shadow-2xl max-w-3xl">
                          <p className="text-[11px] sm:text-xs font-medium text-[#E2FF32]">
                            {profile.quietPlaceBadge} · {profile.fullName}
                          </p>
                          <h2 className="font-display text-lg sm:text-2xl md:text-4xl font-semibold text-white tracking-tight leading-tight">
                            <span className="block">
                              {profile.quietPlaceHeadlineLine1}
                            </span>
                            <span className="block text-zinc-300 text-sm sm:text-lg md:text-2xl mt-0.5">
                              {profile.quietPlaceHeadlineLine2}
                            </span>
                          </h2>
                        </div>

                        {/* Bottom Cards inside Monolith Window: 3 Roadmap Milestones + 4 Programming Languages Bar */}
                        <div className="pointer-events-auto w-full max-w-5xl space-y-2 sm:space-y-2.5 mt-auto max-h-[38dvh] sm:max-h-none overflow-y-auto">
                          {/* Row 1: 2023 Fergana -> 2025 Int'l House Tashkent -> 2026 INHA University Tashkent */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                            {profile.projects.map((proj) => (
                              <button
                                key={proj.id}
                                type="button"
                                onClick={() => setActiveProject(proj)}
                                className="text-left p-2.5 sm:p-3.5 rounded-xl bg-[#0B0B10]/94 hover:bg-[#14141F] border border-white/15 transition-colors cursor-pointer"
                              >
                                <div className="flex items-center justify-between text-[10px] sm:text-xs text-zinc-400 mb-0.5">
                                  <span className="font-mono-code text-[#E2FF32] font-semibold">
                                    {proj.category}
                                  </span>
                                  <span className="font-mono-code tabular-nums text-white">
                                    {proj.year}
                                  </span>
                                </div>
                                <p className="font-display text-xs sm:text-sm font-bold text-white truncate">
                                  {proj.title}
                                </p>
                                <p className="hidden sm:block text-[11px] text-zinc-300 line-clamp-2 mt-1">
                                  {proj.summary}
                                </p>
                              </button>
                            ))}
                          </div>

                          {/* Row 2: 4 Programming Languages & Stack (JavaScript, Python, Full-Stack, and C++ in process of learning) */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {profile.programmingLanguages.map((lang) => (
                              <div
                                key={lang.id}
                                className={`px-3 py-2 rounded-xl border ${
                                  lang.isLearning
                                    ? 'bg-[#14160B]/95 border-[#E2FF32]/50'
                                    : 'bg-[#0B0B10]/94 border-white/12'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-display text-xs font-bold text-white">
                                    {lang.index}. {lang.name}
                                  </span>
                                  <span
                                    className={`font-mono-code text-[10px] ${
                                      lang.isLearning
                                        ? 'text-[#E2FF32] font-semibold'
                                        : 'text-zinc-400'
                                    }`}
                                  >
                                    {lang.status}
                                  </span>
                                </div>
                                <p className="hidden sm:block text-[10px] text-zinc-400 truncate mt-0.5">
                                  {lang.detail}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Collapsible Ergonomic Bottom Control Dock with Stage Switcher & Auto-Play */}
      <BottomControlDock
        activeStage={activeStage}
        onSelectStage={jumpToStage}
        isAutoPlaying={isAutoPlaying}
        onToggleAutoPlay={() => setIsAutoPlaying((prev) => !prev)}
        morphMode={morphMode}
        onChangeMorphMode={setMorphMode}
        scatterType={scatterType}
        onChangeScatterType={setScatterType}
        onRandomize={randomizeParticleState}
        paletteId={paletteId}
        onChangePaletteId={setPaletteId}
        dispersion={dispersion}
        onChangeDispersion={setDispersion}
      />

      {/* Lightbox Modal for Selected Works */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </div>
  );
}
