import React, { useEffect, useState } from 'react';
import {
  LightingPaletteId,
  LIGHTING_PALETTES,
  ParticleMorphMode,
  ScatterAnimationType,
  SCATTER_ANIMATION_LABELS,
} from '../utils/profileAndPrompt';

interface BottomControlDockProps {
  activeStage: 0 | 1 | 2 | 3;
  onSelectStage: (stage: 0 | 1 | 2 | 3) => void;
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
  morphMode: ParticleMorphMode;
  onChangeMorphMode: (mode: ParticleMorphMode) => void;
  scatterType: ScatterAnimationType;
  onChangeScatterType: (type: ScatterAnimationType) => void;
  onRandomize: () => void;
  paletteId: LightingPaletteId;
  onChangePaletteId: (id: LightingPaletteId) => void;
  dispersion: number;
  onChangeDispersion: (val: number) => void;
}

const STAGE_OPTIONS: { stage: 0 | 1 | 2 | 3; label: string }[] = [
  { stage: 0, label: '01. Hello Hero' },
  { stage: 1, label: '02. Macro Memory' },
  { stage: 2, label: '03. Focus & Works' },
  { stage: 3, label: '04. Quiet Monolith' },
];

const MORPH_OPTIONS: { id: ParticleMorphMode; label: string }[] = [
  { id: 'bust', label: 'Bust' },
  { id: 'neural', label: 'Neural' },
  { id: 'architecture', label: 'Voxel' },
  { id: 'wave', label: 'Wave' },
];

const SCATTER_OPTIONS: { id: ScatterAnimationType; label: string }[] = [
  { id: 'fluid', label: 'Fluid' },
  { id: 'vortex', label: 'Vortex' },
  { id: 'pulse', label: 'Pulse' },
  { id: 'cascade', label: 'Cascade' },
];

export const BottomControlDock: React.FC<BottomControlDockProps> = ({
  activeStage,
  onSelectStage,
  isAutoPlaying,
  onToggleAutoPlay,
  morphMode,
  onChangeMorphMode,
  scatterType,
  onChangeScatterType,
  onRandomize,
  paletteId,
  onChangePaletteId,
  dispersion,
  onChangeDispersion,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showMobileTuning, setShowMobileTuning] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'h' || e.key === 'H') {
        setCollapsed((prev) => !prev);
      } else if (e.key === 'r' || e.key === 'R') {
        onRandomize();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onRandomize]);

  return (
    <div
      className="fixed bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center max-w-[min(1080px,96vw)] w-full pointer-events-none"
      role="region"
      aria-label="3D Particle Scene Controls"
    >
      <div className="pointer-events-auto mb-1 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-expanded={!collapsed}
          className="px-3 py-1 text-[11px] sm:text-xs font-medium text-zinc-300 bg-[#0C0C10]/95 border border-white/15 rounded-t-lg hover:text-white hover:border-white/30 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {collapsed ? '▴ Show Controls (H)' : '▾ Hide Controls (H)'}
        </button>

        <button
          type="button"
          onClick={onRandomize}
          title={`Current: ${morphMode.toUpperCase()} · ${SCATTER_ANIMATION_LABELS[scatterType]}`}
          className="px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold text-[#050505] bg-[#E2FF32] hover:bg-[#d4f224] rounded-t-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          🎲 Randomize 3D (R)
        </button>

        {!collapsed && (
          <button
            type="button"
            onClick={() => setShowMobileTuning((prev) => !prev)}
            className="md:hidden px-2.5 py-1 text-[11px] font-medium text-[#E2FF32] bg-[#0C0C10]/95 border border-[#E2FF32]/30 rounded-t-lg whitespace-nowrap shrink-0 cursor-pointer"
          >
            {showMobileTuning ? '▾ Hide 3D Tuning' : '▴ 3D Morph & Scatter'}
          </button>
        )}
      </div>

      {!collapsed && (
        <div className="pointer-events-auto w-full bg-[#0B0B0F]/95 border border-white/15 rounded-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 shadow-2xl flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center justify-between gap-2 sm:gap-2.5">
          {/* Scroll Stage Switcher + Auto-Play Cinema Button */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-0.5 md:pb-0">
            <button
              type="button"
              onClick={onToggleAutoPlay}
              className={`px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isAutoPlaying
                  ? 'bg-[#E2FF32] text-[#050505] border-[#E2FF32]'
                  : 'bg-[#14141D] text-[#E2FF32] border-[#E2FF32]/40 hover:bg-[#1C1C28]'
              }`}
            >
              {isAutoPlaying ? '⏸ Pause Tour' : '▶ Play Animation'}
            </button>

            <div
              className="flex items-center gap-1 p-1 bg-[#14141B] rounded-lg shrink-0"
              role="group"
              aria-label="Main Page Head Animation Stages"
            >
              {STAGE_OPTIONS.map((item) => {
                const active = activeStage === item.stage;
                return (
                  <button
                    key={item.stage}
                    type="button"
                    onClick={() => onSelectStage(item.stage)}
                    className={`px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-white text-[#050505] font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3D Morphology + Scatter Animation Type + Scatter Slider + Palette */}
          <div
            className={`${
              showMobileTuning ? 'flex' : 'hidden md:flex'
            } flex-wrap items-center justify-between md:justify-end gap-2 sm:gap-2.5 pt-1.5 md:pt-0 border-t border-white/10 md:border-t-0`}
          >
            {/* Morph Mode Selector (Bust / Neural / Voxel / Wave) */}
            <div
              className="flex items-center gap-1 p-1 bg-[#14141B] rounded-lg"
              role="group"
              aria-label="Particle Morphology Mode"
            >
              {MORPH_OPTIONS.map((opt) => {
                const active = morphMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChangeMorphMode(opt.id)}
                    className={`px-2 py-1 text-[11px] sm:text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#E2FF32] text-[#050505] font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Scatter Animation Style Selector (Fluid / Vortex / Pulse / Cascade) */}
            <div
              className="flex items-center gap-1 p-1 bg-[#14141B] rounded-lg"
              role="group"
              aria-label="Scatter Animation Type"
            >
              {SCATTER_OPTIONS.map((opt) => {
                const active = scatterType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChangeScatterType(opt.id)}
                    className={`px-2 py-1 text-[11px] sm:text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#A78BFA] text-[#050505] font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <label
                htmlFor="voxel-dispersion-slider"
                className="text-[11px] sm:text-xs text-zinc-400 whitespace-nowrap shrink-0"
              >
                Scatter
              </label>
              <input
                id="voxel-dispersion-slider"
                type="range"
                min={0}
                max={1}
                step={0.02}
                value={dispersion}
                onChange={(e) => onChangeDispersion(parseFloat(e.target.value))}
                className="w-14 sm:w-16 accent-[#E2FF32] cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-1">
              {(Object.keys(LIGHTING_PALETTES) as LightingPaletteId[]).map((id) => {
                const pal = LIGHTING_PALETTES[id];
                const isSelected = paletteId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onChangePaletteId(id)}
                    aria-label={`Select ${pal.label} lighting`}
                    className={`px-2 py-1 text-[11px] sm:text-xs rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'border-[#E2FF32] bg-white/10 text-white font-medium'
                        : 'border-white/10 bg-transparent text-zinc-400 hover:text-white'
                    }`}
                  >
                    {id === 'ivory-indigo'
                      ? 'Ivory'
                      : id === 'lime-obsidian'
                      ? 'Lime'
                      : 'Silver'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
