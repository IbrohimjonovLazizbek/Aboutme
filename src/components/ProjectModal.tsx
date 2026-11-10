import React, { useEffect, useState } from 'react';
import { ProjectItem } from '../utils/profileAndPrompt';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
}) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-8 bg-black/85 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      <div className="relative w-full max-w-3xl max-h-[90dvh] overflow-y-auto bg-[#0C0C10] border border-white/15 rounded-2xl shadow-2xl my-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-[#0C0C10]/95 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-zinc-400">
            <span className="font-mono-code text-zinc-200">{project.index}.</span>
            <span>{project.category}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{project.year}</span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span className="hidden sm:inline tabular-nums text-[#E2FF32]">
              {project.metrics}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="px-2.5 sm:px-3 py-1 text-xs font-medium text-zinc-300 bg-white/5 hover:bg-white/15 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            ESC ✕
          </button>
        </div>

        {/* Media container with Zero-Broken-Image fallback */}
        <div className="relative aspect-video w-full bg-[#12121A] overflow-hidden">
          {!imgError ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 sm:p-8 bg-gradient-to-br from-[#12121C] to-[#08080C] text-center">
              <span className="font-mono-code text-xs text-[#E2FF32] mb-2">
                {project.index} · {project.category}
              </span>
              <p className="font-display text-lg sm:text-xl font-bold text-white">
                {project.title}
              </p>
            </div>
          )}
        </div>

        {/* Details body */}
        <div className="p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4">
          <h3
            id="modal-project-title"
            className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight"
          >
            {project.title}
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-zinc-300 leading-relaxed">
            {project.summary}
          </p>
          <div className="pt-3 border-t border-white/10">
            <h4 className="text-xs font-semibold text-zinc-400 mb-1.5">
              System Architecture & Implementation Notes
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {project.architectureNotes}
            </p>
          </div>
          <div className="pt-3 sm:pt-4 flex flex-wrap items-center justify-end gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#050505] bg-[#E2FF32] hover:bg-[#d4f224] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Done · Return to 3D Stage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
