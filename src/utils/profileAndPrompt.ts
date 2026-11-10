export type ParticleMorphMode = 'bust' | 'neural' | 'architecture' | 'wave';

export type ScatterAnimationType = 'fluid' | 'vortex' | 'pulse' | 'cascade';

export const ALL_MORPH_MODES: ParticleMorphMode[] = [
  'bust',
  'neural',
  'architecture',
  'wave',
];

export const ALL_SCATTER_ANIMATION_TYPES: ScatterAnimationType[] = [
  'fluid',
  'vortex',
  'pulse',
  'cascade',
];

export const SCATTER_ANIMATION_LABELS: Record<ScatterAnimationType, string> = {
  fluid: 'Fluid Curl',
  vortex: 'Vortex Spiral',
  pulse: 'Quantum Pulse',
  cascade: 'Voxel Cascade',
};

export interface RandomParticlePreset {
  morphMode: ParticleMorphMode;
  scatterType: ScatterAnimationType;
  dispersion: number;
  seed: number;
}

/**
 * Generates a fresh random combination of 3D morphology (Bust / Neural / Voxel / Wave),
 * scatter animation style (Fluid / Vortex / Pulse / Cascade), scatter dispersion intensity,
 * and PRNG seed. When previous values are passed, guarantees a new distinct mode & scatter style.
 */
export function pickRandomParticlePreset(
  prevMode?: ParticleMorphMode,
  prevScatterType?: ScatterAnimationType,
  rng: () => number = Math.random
): RandomParticlePreset {
  const modeCandidates = prevMode
    ? ALL_MORPH_MODES.filter((m) => m !== prevMode)
    : ALL_MORPH_MODES;
  const morphMode =
    modeCandidates[Math.floor(rng() * modeCandidates.length)] || 'bust';

  const scatterCandidates = prevScatterType
    ? ALL_SCATTER_ANIMATION_TYPES.filter((s) => s !== prevScatterType)
    : ALL_SCATTER_ANIMATION_TYPES;
  const scatterType =
    scatterCandidates[Math.floor(rng() * scatterCandidates.length)] || 'fluid';

  // Keep bust crisp enough to admire facial details while letting neural/voxel/wave scatter more dynamically
  const rawDispersion =
    morphMode === 'bust' ? 0.02 + rng() * 0.24 : 0.06 + rng() * 0.52;
  const dispersion = Math.round(rawDispersion * 50) / 50;
  const seed = Math.floor(1000 + rng() * 98000);

  return {
    morphMode,
    scatterType,
    dispersion,
    seed,
  };
}

export type LightingPaletteId = 'ivory-indigo' | 'lime-obsidian' | 'monochrome-silver';

export interface LightingPalette {
  id: LightingPaletteId;
  label: string;
  warmHex: string;
  coolHex: string;
  coreHex: string;
  accentHex: string;
}

export const LIGHTING_PALETTES: Record<LightingPaletteId, LightingPalette> = {
  'ivory-indigo': {
    id: 'ivory-indigo',
    label: 'Ivory & Periwinkle (Reference)',
    warmHex: '#FFF8E1',
    coolHex: '#C4B5FD',
    coreHex: '#FFFFFF',
    accentHex: '#E2FF32',
  },
  'lime-obsidian': {
    id: 'lime-obsidian',
    label: 'Electric Lime & Cobalt',
    warmHex: '#E2FF32',
    coolHex: '#93C5FD',
    coreHex: '#F7FEE7',
    accentHex: '#E2FF32',
  },
  'monochrome-silver': {
    id: 'monochrome-silver',
    label: 'Studio Silver & Slate',
    warmHex: '#FFFFFF',
    coolHex: '#CBD5E1',
    coreHex: '#F8FAFC',
    accentHex: '#F8FAFC',
  },
};

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  category: string;
  year: string;
  metrics: string;
  summary: string;
  architectureNotes: string;
  imageUrl: string;
  featured?: boolean;
  liveUrl?: string;
}

export interface ExperienceItem {
  id: string;
  index: string;
  role: string;
  organization: string;
  period: string;
  location: string;
  impact: string;
}

export interface MetricItem {
  label: string;
  value: string;
  context: string;
}

export interface ActivityBarItem {
  timeLabel: string;
  purpleHeight: number; // 0 to 100
  limeHeight: number; // 0 to 100
}

export interface ProgrammingLanguageItem {
  id: string;
  index: string;
  name: string;
  status: string;
  proficiency: number; // 0 to 100
  detail: string;
  isLearning?: boolean;
}

export interface PersonalProfile {
  brandWordmark: string;
  heroGreetingPrefix: string;
  heroPixelWord: string;
  heroDisplayName: string;
  fullName: string;
  roleTitle: string;
  versionTag: string;
  systemSubtitle: string;
  statusListeningText: string;
  heroStatementLine1: string;
  heroStatementLine2: string;
  heroStatementLine3: string;
  memoryStageBadge: string;
  memoryStageHeadline: string;
  memoryStageSubtext: string;
  goldenTimeTitle: string;
  goldenTimeBadge: string;
  goldenTimePercent: string;
  goldenTimeSubtitle: string;
  goldenTimeFootnote: string;
  weeklyHandledSummary: string;
  quietPlaceBadge: string;
  quietPlaceHeadlineLine1: string;
  quietPlaceHeadlineLine2: string;
  location: string;
  email: string;
  githubHandle: string;
  aboutHeadline: string;
  aboutLead: string;
  aboutBody: string;
  disciplines: string[];
  programmingLanguages: ProgrammingLanguageItem[];
  activityBars: ActivityBarItem[];
  metrics: MetricItem[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
}

export const DEFAULT_LAZIZXON_PROFILE: PersonalProfile = {
  brandWordmark: 'Lazizbek.OS',
  heroGreetingPrefix: 'HELLO,',
  heroPixelWord: "I'M",
  heroDisplayName: 'LAZIZBEK',
  fullName: 'Lazizbek Ibrohimjonov',
  roleTitle: 'CS Student @ INHA University · Full-Stack Developer',
  versionTag: 'CV Profile 2026',
  systemSubtitle: 'Fergana (2023) · Int’l House (2025) · INHA Tashkent (2026)',
  statusListeningText: 'Lazizbek · INHA University in Tashkent',
  heroStatementLine1: 'Lazizbek engineers full-stack software',
  heroStatementLine2: 'from Fergana (2023) to INHA Tashkent (2026).',
  heroStatementLine3: 'JavaScript · Python · Full-Stack · C++ (Learning).',
  memoryStageBadge: 'Academic & Engineering Roadmap · 2023 — 2026',
  memoryStageHeadline:
    'From Specialized School in Fergana (2023) to International House Tashkent (2025) and INHA University in Tashkent (2026).',
  memoryStageSubtext:
    'A progressive computer science journey across Uzbekistan—combining strong algorithmic foundations with JavaScript, Python, Full-Stack web engineering, and active C++ study.',
  goldenTimeTitle: '4 Programming Languages & Core Stack',
  goldenTimeBadge: '3 Proficient · 1 Learning',
  goldenTimePercent: '4 Languages',
  goldenTimeSubtitle: 'JavaScript, Python & Full-Stack + C++ in process of learning',
  goldenTimeFootnote:
    'Active Stack: JavaScript · Python · Full-Stack Development · C++ (In Process of Learning at INHA University)',
  weeklyHandledSummary:
    'Roadmap: 2023 Specialized School Fergana → 2025 Int’l House Tashkent → 2026 INHA University',
  quietPlaceBadge: 'Lazizbek CV · Education & Programming Stack',
  quietPlaceHeadlineLine1: '2023 Fergana · 2025 Int’l House · 2026 INHA Tashkent',
  quietPlaceHeadlineLine2: 'JavaScript · Python · Full-Stack · C++ (In Process of Learning)',
  location: 'jedi.uz · Fergana → Tashkent, Uzbekistan',
  email: 'ibrohimjonovlazizxon@gmail.com',
  githubHandle: 'jedi.uz · github.com/lazizbek',
  aboutHeadline:
    'Computer Science student at INHA University in Tashkent with a proven roadmap from Fergana Specialized School and International House Tashkent.',
  aboutLead:
    'I am Lazizbek Ibrohimjonov—a software developer and Computer Science student whose academic roadmap spans entering the Specialized School in Fergana in 2023, studying at International House Tashkent in 2025, and entering INHA University in Tashkent in 2026.',
  aboutBody:
    'I build modern web applications and software systems using JavaScript, Python, and Full-Stack technologies, and I am currently in the process of learning C++ for high-performance systems and object-oriented programming.',
  disciplines: [
    'JavaScript (ES6+ / Modern Web)',
    'Python Programming & Scripting',
    'Full-Stack Web Development',
    'C++ (In Process of Learning)',
  ],
  programmingLanguages: [
    {
      id: 'lang-js',
      index: '01',
      name: 'JavaScript',
      status: 'Proficient',
      proficiency: 94,
      detail: 'Interactive frontend apps, ES6+, TypeScript & real-time 3D WebGL UI',
      isLearning: false,
    },
    {
      id: 'lang-py',
      index: '02',
      name: 'Python',
      status: 'Proficient',
      proficiency: 92,
      detail: 'Algorithms, backend logic, automation scripts & data processing',
      isLearning: false,
    },
    {
      id: 'lang-fs',
      index: '03',
      name: 'Full-Stack',
      status: 'Proficient',
      proficiency: 90,
      detail: 'End-to-end React, Node.js, REST APIs & modern web architecture',
      isLearning: false,
    },
    {
      id: 'lang-cpp',
      index: '04',
      name: 'C++',
      status: 'In Process of Learning',
      proficiency: 58,
      detail: 'Currently learning C++ — systems programming, memory & OOP at INHA University',
      isLearning: true,
    },
  ],
  activityBars: [
    { timeLabel: '2023', purpleHeight: 62, limeHeight: 28 },
    { timeLabel: '2025', purpleHeight: 82, limeHeight: 54 },
    { timeLabel: '2026', purpleHeight: 96, limeHeight: 90 },
    { timeLabel: 'JS/PY', purpleHeight: 94, limeHeight: 86 },
    { timeLabel: 'STACK', purpleHeight: 90, limeHeight: 84 },
    { timeLabel: 'C++', purpleHeight: 58, limeHeight: 76 },
  ],
  metrics: [
    {
      value: '2023',
      label: 'Specialized School Fergana',
      context: 'Entered Specialized School in Fergana — STEM & coding foundation',
    },
    {
      value: '2025',
      label: 'Int’l House Tashkent',
      context: 'Entered as a student at International House Tashkent lyceum',
    },
    {
      value: '2026',
      label: 'INHA University Tashkent',
      context: 'Entered INHA University in Tashkent — Computer Science & Engineering',
    },
    {
      value: '4 Stack',
      label: 'JS · Python · Full-Stack · C++',
      context: '3 core languages/stacks mastered + C++ in process of learning',
    },
  ],
  projects: [
    {
      id: 'roadmap-2023-fergana',
      index: '2023',
      title: 'Specialized School in Fergana',
      category: 'Milestone 01 · Entered in 2023',
      year: '2023',
      metrics: 'Fergana · STEM & Algorithms Track',
      summary:
        'Entered the Specialized School in Fergana in 2023, building a strong foundation in mathematics, analytical problem solving, and foundational programming.',
      architectureNotes:
        'Focused on Olympiad-style mathematics, logical reasoning, and early software development fundamentals that launched my computer science trajectory.',
      imageUrl: '/src/assets/images/project_kinetic_typography_lab_1794291238948.jpg',
      featured: false,
    },
    {
      id: 'roadmap-2025-iht',
      index: '2025',
      title: 'International House Tashkent',
      category: 'Milestone 02 · Student in 2025',
      year: '2025',
      metrics: 'Tashkent · Advanced Academic Lyceum',
      summary:
        'Entered as a student at International House Tashkent in 2025, advancing in computer science, Python programming, JavaScript, and full-stack web projects.',
      architectureNotes:
        'Completed intensive coursework in exact sciences, English communication, and practical full-stack web engineering in Tashkent.',
      imageUrl: '/src/assets/images/project_voxel_vision_engine_1794291236158.jpg',
      featured: false,
    },
    {
      id: 'roadmap-2026-inha',
      index: '2026',
      title: 'INHA University in Tashkent',
      category: 'Milestone 03 · Entered in 2026',
      year: '2026',
      metrics: 'Tashkent · Computer Science & Engineering',
      summary:
        'Entered INHA University in Tashkent (IUT) in 2026 to pursue Computer Science & Engineering—combining JavaScript, Python, and Full-Stack development while actively learning C++.',
      architectureNotes:
        'Studying university-level software engineering, algorithms, object-oriented programming in C++, and scalable full-stack web systems.',
      imageUrl: '/src/assets/images/project_neural_os_interface_1794291235511.jpg',
      featured: true,
    },
  ],
  experience: [
    {
      id: 'exp-2023-fergana',
      index: '2023',
      role: 'Entered Specialized School in Fergana',
      organization: 'Fergana School',
      period: '2023 — 2025',
      location: 'Fergana',
      impact:
        'Entered Specialized School in Fergana in 2023; mastered core mathematics, algorithmic problem-solving, and began programming with Python and JavaScript.',
    },
    {
      id: 'exp-2025-iht',
      index: '2025',
      role: 'Student at International House Tashkent',
      organization: 'Int’l House Tashkent',
      period: '2025 — 2026',
      location: 'Tashkent',
      impact:
        'Entered International House Tashkent in 2025; built full-stack web applications with JavaScript and Python while preparing for university computer science.',
    },
    {
      id: 'exp-2026-inha',
      index: '2026',
      role: 'Entered INHA University in Tashkent',
      organization: 'INHA University',
      period: '2026 — Present',
      location: 'Tashkent',
      impact:
        'Entered INHA University in Tashkent in 2026; advancing in Full-Stack engineering, JavaScript, and Python while actively in the process of learning C++.',
    },
  ],
};

export const KIN_REFERENCE_PROFILE: PersonalProfile = {
  ...DEFAULT_LAZIZXON_PROFILE,
  brandWordmark: 'Kin.OS',
  heroGreetingPrefix: 'HELLO,',
  heroPixelWord: "I'M",
  heroDisplayName: 'KIN',
  fullName: 'Kin Operating System',
  roleTitle: 'On-Device Personal Intelligence',
  versionTag: 'Kin OS 0.9',
  systemSubtitle: 'on-device memory · private beta',
  statusListeningText: 'Kin is listening',
  heroStatementLine1: 'Kin is the operating system',
  heroStatementLine2: 'that sees you.',
  heroStatementLine3: 'It asks before it acts.',
  memoryStageBadge: 'On-device · Memory',
  memoryStageHeadline: 'Kin remembers every detail on-device so you never repeat yourself.',
  goldenTimeTitle: 'Golden time',
  goldenTimeBadge: 'Needs you · 3',
  goldenTimePercent: '78%',
  goldenTimeSubtitle: 'handled while you focused',
  goldenTimeFootnote: '22% needed you · they wait for you at 9:30',
  weeklyHandledSummary: '3,240 handled this week · 3 waiting for you',
  quietPlaceBadge: 'Kin OS',
  quietPlaceHeadlineLine1: 'Everything around you,',
  quietPlaceHeadlineLine2: 'in one quiet place.',
};

export interface ProfileValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateProfileInput(input: {
  fullName: string;
  heroDisplayName: string;
  roleTitle: string;
  email: string;
  aboutLead: string;
}): ProfileValidationResult {
  const errors: Record<string, string> = {};

  if (!input.fullName || input.fullName.trim().length < 2) {
    errors.fullName = 'Full name is required (at least 2 characters).';
  }
  if (!input.heroDisplayName || input.heroDisplayName.trim().length < 2) {
    errors.heroDisplayName = 'Hero display name is required (e.g. LAZIZXON).';
  }
  if (!input.roleTitle || input.roleTitle.trim().length < 3) {
    errors.roleTitle = 'Role title is required.';
  }
  if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!input.aboutLead || input.aboutLead.trim().length < 15) {
    errors.aboutLead = 'About summary must be at least 15 characters.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export interface ScrollStagePose {
  activeStage: 0 | 1 | 2 | 3;
  bustX: number;
  bustY: number;
  bustZ: number;
  bustRotY: number;
  bustRotX: number;
  cameraZ: number;
  monolithFrameProgress: number;
}

/**
 * Pure choreography function mapping normalized scroll progress [0..1]
 * to the 4 keyframe stages of the MotionSites "Particle Self" video:
 * - Stage 0 (0.00 - 0.24): Centered Bust in front of "HELLO, I'M LAZIZXON"
 * - Stage 1 (0.24 - 0.50): Macro Close-Up Pan Left + Floating On-Device Memory / Bio Cards on Right
 * - Stage 2 (0.50 - 0.76): Macro Close-Up Pan Right + Purple/Lime Telemetry & Golden Time Cards on Left
 * - Stage 3 (0.76 - 1.00): "Everything around you, in one quiet place" Framed Monolith Window
 */
export function computeScrollCameraPose(
  scrollProgress: number,
  viewportAspect = 1.6
): ScrollStagePose {
  const p = Math.max(0, Math.min(1, scrollProgress));
  const smooth = (t: number) => t * t * (3 - 2 * t);

  const isPhone = viewportAspect < 0.82;
  const isTablet = viewportAspect >= 0.82 && viewportAspect < 1.22;

  // Slightly bigger middle guy (closer cameraZ + 1.15x bust scale) while positioned lower so "HELLO, I'M LAZIZXON" at top is 100% unobstructed
  const heroCamZ = isPhone ? 3.74 : isTablet ? 3.32 : 3.08;
  const heroBustY = isPhone ? -0.56 : isTablet ? -0.68 : -0.78;

  // On phones, Stage 1 & Stage 2 frame the macro 3D voxel face in the upper viewport while cards dock below
  const stage1TargetX = isPhone ? -0.14 : isTablet ? -0.42 : -0.64;
  const stage1TargetY = isPhone ? 0.12 : isTablet ? -0.22 : -0.36;
  const stage1CamZ = isPhone ? 2.36 : isTablet ? 2.02 : 1.76;

  const stage2TargetX = isPhone ? 0.14 : isTablet ? 0.42 : 0.64;
  const stage2TargetY = isPhone ? 0.12 : isTablet ? -0.22 : -0.34;
  const stage2CamZ = isPhone ? 2.32 : isTablet ? 1.98 : 1.72;

  const stage3TargetY = isPhone ? -0.22 : isTablet ? -0.34 : -0.42;
  const stage3CamZ = isPhone ? 3.95 : isTablet ? 3.65 : 3.45;

  if (p < 0.24) {
    const t = smooth(Math.min(1, p / 0.24));
    return {
      activeStage: 0,
      bustX: 0 - t * (isPhone ? 0.03 : 0.06),
      bustY: heroBustY,
      bustZ: 0,
      bustRotY: -0.12 + t * 0.05,
      bustRotX: 0.02,
      cameraZ: heroCamZ - t * 0.14,
      monolithFrameProgress: 0,
    };
  } else if (p < 0.5) {
    // Settle into Macro Left Close-Up within the first 40% of Stage 1 and hold cleanly
    const t = smooth(Math.min(1, (p - 0.24) / 0.1));
    const startX = isPhone ? -0.03 : -0.06;
    const startCamZ = heroCamZ - 0.14;
    return {
      activeStage: 1,
      bustX: startX + t * (stage1TargetX - startX),
      bustY: heroBustY + t * (stage1TargetY - heroBustY),
      bustZ: t * (isPhone ? 0.18 : 0.32),
      bustRotY: -0.14 + t * 0.44, // turns right (+0.30) toward the Memory card
      bustRotX: 0.02 - t * 0.05,
      cameraZ: startCamZ + t * (stage1CamZ - startCamZ),
      monolithFrameProgress: 0,
    };
  } else if (p < 0.76) {
    // Settle into Macro Right Close-Up within the first 40% of Stage 2 and hold cleanly
    const t = smooth(Math.min(1, (p - 0.5) / 0.1));
    return {
      activeStage: 2,
      bustX: stage1TargetX + t * (stage2TargetX - stage1TargetX),
      bustY: stage1TargetY + t * (stage2TargetY - stage1TargetY),
      bustZ: (isPhone ? 0.18 : 0.32) - t * 0.02,
      bustRotY: 0.3 - t * 0.64, // turns left (-0.34) showing sculpted voxel cheek/nose/lips
      bustRotX: -0.03 + t * 0.01,
      cameraZ: stage1CamZ + t * (stage2CamZ - stage1CamZ),
      monolithFrameProgress: 0,
    };
  } else {
    // Settle into Framed Monolith Window within the first 40% of Stage 3
    const t = smooth(Math.min(1, (p - 0.76) / 0.1));
    return {
      activeStage: 3,
      bustX: stage2TargetX * (1 - t), // returns to 0.0 center
      bustY: stage2TargetY + t * (stage3TargetY - stage2TargetY),
      bustZ: (isPhone ? 0.16 : 0.3) * (1 - t),
      bustRotY: -0.34 + t * 0.2, // settles at -0.14
      bustRotX: -0.02 * (1 - t),
      cameraZ: stage2CamZ + t * (stage3CamZ - stage2CamZ),
      monolithFrameProgress: t,
    };
  }
}

/**
 * Deterministic PRNG (Mulberry32) so 3D particle clouds are reproducible and testable.
 */
export function createSeededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface ParticleCloudBuffers {
  count: number;
  bustPositions: Float32Array;
  neuralPositions: Float32Array;
  architecturePositions: Float32Array;
  wavePositions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  phases: Float32Array;
}

/**
 * Generates a high-definition anatomical 3D human bust composed of structured LiDAR voxel scanlines
 * AND analytical 3D surface-normal lighting across sculpted human facial anatomy (dorsal nose bridge,
 * pronasale nose tip, nostrils, superciliary brow arches, recessed orbital sockets, eyelids & irises,
 * cheekbones, philtrum, Cupid's bow lips, chin & jawline contour, detailed left/right ears with
 * helix/tragus/earlobe, natural hair crown, sternocleidomastoid neck muscles, and S-curved clavicles).
 */
export function generateParticleSelfBuffers(
  count: number,
  palette: LightingPalette = LIGHTING_PALETTES['ivory-indigo'],
  seed = 1337
): ParticleCloudBuffers {
  const rand = createSeededRandom(seed);
  const bustPositions = new Float32Array(count * 3);
  const neuralPositions = new Float32Array(count * 3);
  const architecturePositions = new Float32Array(count * 3);
  const wavePositions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);

  const parseHexRGB = (hex: string): [number, number, number] => {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return [
      ((num >> 16) & 255) / 255,
      ((num >> 8) & 255) / 255,
      (num & 255) / 255,
    ];
  };

  const [warmR, warmG, warmB] = parseHexRGB(palette.warmHex);
  const [coolR, coolG, coolB] = parseHexRGB(palette.coolHex);
  const [coreR, coreG, coreB] = parseHexRGB(palette.coreHex);

  const gaussian = (x: number, mu: number, sigma: number) => {
    const d = (x - mu) / sigma;
    return Math.exp(-0.5 * d * d);
  };

  const quantize = (v: number, step: number) => Math.round(v / step) * step;

  // 1.18x larger human figure for commanding main-stage presence
  const BUST_SCALE = 1.18;
  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

  // Smooth, realistic 3D anatomical facial relief heightfield z(nx, ny)
  // ny spans [-0.50 (chin tip) .. +0.50 (top of forehead/crown)], nx spans [-0.36 .. +0.36]
  const sampleFaceRelief = (
    nx: number,
    ny: number
  ): { z: number; highlight: number; shadow: number } => {
    const absX = Math.abs(nx);

    // 1. Masculine Superciliary Brow Bar & Eyebrow Arch (ny ~ 0.16..0.22)
    const browArchY = 0.18 + 0.024 * Math.sin(Math.min(1, absX / 0.24) * Math.PI);
    const brow =
      0.068 *
      gaussian(ny, browArchY, 0.042) *
      gaussian(absX, 0.135, 0.105);

    // 2. Recessed Orbital Eye Sockets (ny ~ 0.095, absX ~ 0.135)
    const socket =
      -0.072 *
      gaussian(ny, 0.095, 0.052) *
      gaussian(absX, 0.135, 0.072);

    // 3. Sculpted Upper & Lower Eyelid Folds + Eyeball Convexity (no cartoon rings!)
    const eyeHoriz = gaussian(absX, 0.135, 0.052);
    const upperLidY = 0.118 - 0.16 * Math.pow(absX - 0.135, 2);
    const lowerLidY = 0.072 + 0.12 * Math.pow(absX - 0.135, 2);
    const upperLid = 0.052 * gaussian(ny, upperLidY, 0.014) * eyeHoriz;
    const lowerLid = 0.038 * gaussian(ny, lowerLidY, 0.014) * eyeHoriz;
    const eyeball =
      0.044 *
      gaussian(ny, 0.095, 0.028) *
      gaussian(absX, 0.135, 0.038);

    // 4. Sculpted Human Nose Pyramid: Radix, Dorsal Bridge, Pronasale Tip, Columella & Alar Nostril Wings
    // Nose bridge runs from ny = +0.16 down to pronasale tip at ny = -0.075
    const noseT = Math.max(0, Math.min(1, (0.17 - ny) / 0.25));
    const noseSigmaX = 0.028 + noseT * 0.024;
    const noseBridge =
      (0.082 + noseT * 0.088) *
      gaussian(nx, 0, noseSigmaX) *
      gaussian(ny, 0.025, 0.11);
    const noseTip =
      0.105 *
      gaussian(nx, 0, 0.038) *
      gaussian(ny, -0.072, 0.038);
    const alarWings =
      0.072 *
      gaussian(absX, 0.058, 0.024) *
      gaussian(ny, -0.088, 0.028);
    const underNoseShadow =
      -0.048 *
      gaussian(nx, 0, 0.058) *
      gaussian(ny, -0.112, 0.018);

    // 5. Zygomatic Cheekbones & Buccal Cheek Hollows
    const cheekbone =
      0.064 *
      gaussian(ny, 0.00, 0.082) *
      gaussian(absX, 0.215, 0.085);
    const buccalHollow =
      -0.028 *
      gaussian(ny, -0.18, 0.075) *
      gaussian(absX, 0.20, 0.065);
    const nasolabial =
      -0.024 *
      gaussian(absX, 0.082 + Math.max(0, (-0.06 - ny) * 0.42), 0.020) *
      gaussian(ny, -0.16, 0.075);

    // 6. Philtrum, Cupid's Bow Upper Lip, Oral Parting Line, Full Lower Lip
    const philtrum =
      -0.020 *
      gaussian(nx, 0, 0.018) *
      gaussian(ny, -0.145, 0.026);
    const cupidsBowY = -0.185 + 0.010 * gaussian(absX, 0.028, 0.018) - 0.14 * absX * absX;
    const upperLip =
      0.074 *
      gaussian(ny, cupidsBowY, 0.022) *
      gaussian(nx, 0, 0.095);
    const mouthCleft =
      -0.052 *
      gaussian(ny, -0.218 + 0.03 * absX * absX, 0.011) *
      gaussian(nx, 0, 0.105);
    const lowerLip =
      0.070 *
      gaussian(ny, -0.252, 0.025) *
      gaussian(nx, 0, 0.085);

    // 7. Mentolabial Sulcus (Under-Lip Crease), Chiseled Chin & Mandibular Jawline
    const chinCrease =
      -0.038 *
      gaussian(ny, -0.305, 0.024) *
      gaussian(nx, 0, 0.088);
    const chinProminence =
      0.082 *
      gaussian(ny, -0.38, 0.055) *
      gaussian(nx, 0, 0.105);
    const jawlineRidge =
      0.045 *
      gaussian(ny, -0.38 + 0.56 * absX, 0.048) *
      gaussian(absX, 0.19, 0.095);

    const z =
      brow +
      socket +
      upperLid +
      lowerLid +
      eyeball +
      noseBridge +
      noseTip +
      alarWings +
      underNoseShadow +
      cheekbone +
      buccalHollow +
      nasolabial +
      philtrum +
      upperLip +
      mouthCleft +
      lowerLip +
      chinCrease +
      chinProminence +
      jawlineRidge;

    // Smooth sculptural highlight [0..1] and shadow [0..1] weights
    const highlight = Math.min(
      1,
      Math.max(
        0,
        (noseBridge + noseTip) * 5.2 +
          alarWings * 4.5 +
          (upperLid + lowerLid) * 5.0 +
          brow * 4.2 +
          (upperLip + lowerLip) * 4.6 +
          chinProminence * 3.8 +
          cheekbone * 3.2 +
          jawlineRidge * 3.0
      )
    );

    const eyeHollowMask = Math.max(0, -socket * 9.5) * (1 - Math.min(1, (upperLid + lowerLid) * 14));
    const noseSidewallMask =
      gaussian(absX, 0.048, 0.018) * gaussian(ny, 0.02, 0.095) * 0.72;
    const nostrilMask = Math.max(0, -underNoseShadow * 12.0);
    const mouthLineMask = Math.max(0, -mouthCleft * 12.0);
    const chinCreaseMask = Math.max(0, -chinCrease * 9.0) + Math.max(0, -buccalHollow * 6.0);

    const shadow = Math.min(
      1,
      eyeHollowMask + noseSidewallMask + nostrilMask + mouthLineMask + chinCreaseMask
    );

    return { z, highlight, shadow };
  };

  const headEnd = Math.floor(count * 0.62);
  const earEnd = Math.floor(count * 0.70);
  const hairEnd = Math.floor(count * 0.78);
  const neckEnd = Math.floor(count * 0.87);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const u = rand();
    const v = rand();
    const w = rand();
    phases[i] = rand() * Math.PI * 2;

    let bx = 0;
    let by = 0;
    let bz = 0;
    let highlightWeight = 0.35;
    let shadowWeight = 0.0;
    let pointSizeScale = 1.0;

    if (i < headEnd) {
      // --- ZONE 1: FIBONACCI-DISTRIBUTED ANATOMICAL HUMAN HEAD & FACE (62%) ---
      // Golden-ratio Fibonacci sampling guarantees 100% uniform, hole-free coverage across the cheeks, nose, eyes, forehead, and jaw!
      const idx = i;
      const totalHead = headEnd;
      const fibT = (idx + 0.5) / totalHead;

      // Stratify into 96 crisp horizontal scanline bands with slight organic dithering
      const rawCosLat = 1 - 2 * fibT; // +1 (crown) to -1 (chin base)
      const quantCosLat = quantize(rawCosLat, 1 / 48) + (u - 0.5) * 0.012;
      const cosLat = Math.max(-0.995, Math.min(0.995, quantCosLat));
      const sinLat = Math.sqrt(Math.max(0.01, 1 - cosLat * cosLat));

      // Golden angle wrapped cleanly into the front & side hemisphere [-0.66*PI, +0.66*PI] (85%) and back cranium (15%)
      const fibFrac = (idx * GOLDEN_ANGLE) % (Math.PI * 2);
      const normFrac = fibFrac / (Math.PI * 2); // [0..1]
      const scanAz =
        normFrac < 0.86
          ? ((normFrac / 0.86) - 0.5) * Math.PI * 1.30
          : ((normFrac - 0.86) / 0.14 - 0.5) * Math.PI * 2.0;

      // Classical Loomis Human Head Proportions (1 : 1.50 width-to-height ratio, chiseled jawline & chin)
      let rx = 0.355;
      const ry = 0.50;
      let rz = 0.42;

      // Temple narrowing above brows
      if (cosLat > 0.18 && cosLat < 0.62) {
        rx *= 1.0 - 0.065 * gaussian(cosLat, 0.36, 0.14);
      }
      // Cheekbone flare at cosLat ~ 0.0
      if (Math.abs(cosLat) < 0.18) {
        rx *= 1.0 + 0.045 * gaussian(cosLat, 0.0, 0.10);
      }
      // Chiseled mandibular taper from cheekbones down through gonial jaw corner to chin tip
      if (cosLat < -0.02) {
        const jawT = Math.min(1, (-0.02 - cosLat) / 0.98);
        // Hold width to the gonial jaw corner (jawT ~ 0.45), then taper sharply to the chin!
        const taperCurve = jawT < 0.42 ? jawT * 0.38 : 0.16 + Math.pow((jawT - 0.42) / 0.58, 1.35) * 0.54;
        rx *= 1.0 - taperCurve;
        rz *= 1.0 - Math.pow(jawT, 1.4) * 0.22;
      }

      let baseNx = rx * sinLat * Math.sin(scanAz);
      let baseNy = ry * cosLat;
      let baseNz = rz * sinLat * Math.cos(scanAz);

      // 86% crisp outer surface scanlines + 14% subtle interior support
      const isInterior = idx % 7 === 0;

      if (Math.abs(scanAz) < 1.32 && !isInterior) {
        const eps = 0.007;
        const center0 = sampleFaceRelief(baseNx, baseNy);
        const dx0 = sampleFaceRelief(baseNx + eps, baseNy);
        const dy0 = sampleFaceRelief(baseNx, baseNy + eps);

        const gradX0 = (dx0.z - center0.z) / eps;
        const gradY0 = (dy0.z - center0.z) / eps;

        // Gradient-ascent anatomical ridge flow: particles naturally migrate out of recessed creases
        // (eye hollows, nose sidewall grooves, nostrils, mouth cleft, under-lip crease) and concentrate
        // onto protruding human anatomy (nose bridge/tip/alar wings, brow arches, eyelids, lips, cheekbones, chin)
        const flowStrength = 0.024 * Math.cos(scanAz * 0.85);
        baseNx += Math.max(-0.028, Math.min(0.028, gradX0 * flowStrength));
        baseNy += Math.max(-0.028, Math.min(0.028, gradY0 * flowStrength));

        // Re-evaluate relief & analytical surface normal at the sculpted anatomical position
        const center = sampleFaceRelief(baseNx, baseNy);
        const dxSample = sampleFaceRelief(baseNx + eps, baseNy);
        const dySample = sampleFaceRelief(baseNx, baseNy + eps);

        const dzdx = (dxSample.z - center.z) / eps;
        const dzdy = (dySample.z - center.z) / eps;
        const invLen = 1 / Math.sqrt(dzdx * dzdx + dzdy * dzdy + 1);
        const normNx = (-dzdx * 0.78 + Math.sin(scanAz) * 0.22) * invLen;
        const normNy = (-dzdy * 0.78 + cosLat * 0.22) * invLen;
        const normNz = invLen;

        const keyDot = Math.max(0, normNx * 0.32 + normNy * 0.38 + normNz * 0.86);
        const atten = Math.cos(scanAz * 0.88);
        baseNz += center.z * atten;

        highlightWeight = Math.min(1, 0.18 + 0.48 * keyDot + center.highlight * 0.78);
        shadowWeight = Math.min(1, center.shadow * 1.15 + (1 - keyDot) * 0.42);
        pointSizeScale = 0.72 + highlightWeight * 0.52 - shadowWeight * 0.28;
      } else {
        highlightWeight = 0.12;
        shadowWeight = 0.68;
        pointSizeScale = 0.76;
      }

      const radialFill = isInterior ? 0.68 + 0.26 * rand() : 0.988 + 0.012 * rand();

      bx = baseNx * radialFill;
      by = 0.36 + baseNy * (isInterior ? 0.90 + 0.10 * rand() : radialFill);
      bz = baseNz * radialFill;
    } else if (i < earEnd) {
      // --- ZONE 2: PROPORTIONATE SCULPTED HUMAN EARS (LEFT & RIGHT PINNA: HELIX, ANTIHELIX, TRAGUS, CONCHA, EARLOBE) (8%) ---
      const earIdx = i - headEnd;
      const side = earIdx % 2 === 0 ? 1 : -1;
      // Position ears anatomically between brow level (y ~ 0.48) and nose base (y ~ 0.24)
      const tEar = (w - 0.5) * 2; // -1 (earlobe) to +1 (upper helix arch)
      const rEar = Math.pow(v, 0.62); // 0 (inner concha) to 1 (outer helix rim)

      const earHeight = 0.125;
      const earCenterY = 0.355;
      const earWidth =
        0.056 *
        (0.76 + 0.28 * Math.sin((tEar + 1) * 1.3)) *
        Math.sqrt(Math.max(0.15, 1 - 0.68 * tEar * tEar));

      const isHelixRim = rEar > 0.74;
      const isAntihelix = rEar > 0.42 && rEar < 0.65 && tEar > -0.42;
      const isEarlobe = tEar < -0.55;
      const isTragus = rEar < 0.36 && Math.abs(tEar + 0.1) < 0.24;

      // Attach flush to the side of the narrower human head (x ~ 0.335)
      const headSideX = 0.335 - 0.025 * Math.abs(tEar);
      const earOutwardX = headSideX + rEar * earWidth + (isHelixRim ? 0.014 : 0);

      const earZBase = -0.025 - tEar * 0.022;
      const cupZ =
        (isHelixRim ? 0.026 : isAntihelix ? 0.016 : isTragus ? 0.028 : -0.014) +
        (rEar - 0.5) * 0.038;

      bx = side * earOutwardX;
      by = quantize(earCenterY + tEar * earHeight, 0.007);
      bz = earZBase + cupZ;

      highlightWeight = isHelixRim || isEarlobe || isTragus ? 0.96 : isAntihelix ? 0.74 : 0.14;
      shadowWeight = isHelixRim || isEarlobe || isTragus ? 0.0 : isAntihelix ? 0.18 : 0.78;
      pointSizeScale = isHelixRim || isEarlobe || isTragus ? 1.16 : 0.78;
    } else if (i < hairEnd) {
      // --- ZONE 3: NATURAL SCULPTED HAIR CROWN & TEMPLE HAIRLINE (8%) ---
      const rawAz = (v - 0.5) * Math.PI * 1.48;
      const crownT = Math.pow(w, 0.68);
      const lat = 0.10 + (1 - crownT) * 0.76;
      const cosLat = Math.cos(lat);

      // Keep forehead open below cosLat = 0.64 on front face
      const isFrontForehead = Math.abs(rawAz) < 0.86 && cosLat < 0.64;
      const adjustedCosLat = isFrontForehead ? 0.64 + cosLat * 0.32 : cosLat;
      const adjustedSinLat = Math.sqrt(Math.max(0.04, 1 - adjustedCosLat * adjustedCosLat));

      const strandWave =
        Math.sin(rawAz * 16 + crownT * 7) * 0.012 +
        Math.cos(rawAz * 9 - crownT * 10) * 0.009;
      const loft = 0.014 + 0.022 * Math.sin(crownT * Math.PI) + strandWave;

      bx = (0.355 + loft) * adjustedSinLat * Math.sin(rawAz);
      by = 0.36 + (0.50 + loft) * adjustedCosLat;
      bz = (0.42 + loft) * adjustedSinLat * Math.cos(rawAz);
      highlightWeight = 0.54 + 0.25 * Math.sin(rawAz * 12 + crownT * 8);
      shadowWeight = 0.26;
    } else if (i < neckEnd) {
      // --- ZONE 4: SLENDER ANATOMICAL NECK, STERNOCLEIDOMASTOID V-MUSCLES & SUBMENTAL SHADOW (9%) ---
      // Distinctly narrower than the jawline (radX = 0.185 vs head rx = 0.355) so the chin & jaw silhouette is unmistakable!
      const rawAz = (v - 0.5) * Math.PI * 1.32;
      const scanAz = Math.round(rawAz * 52) / 52;
      const scanT = Math.round(w * 32) / 32; // 0 (clavicles) to 1 (under jaw)
      const y = -0.42 + scanT * 0.32;

      const trapFlare = Math.pow(1 - scanT, 1.75) * 0.22;
      const scmTargetAz = 0.10 + scanT * 0.72;
      const scmRidge = 0.032 * gaussian(Math.abs(scanAz), scmTargetAz, 0.15);
      const larynx = 0.024 * gaussian(scanAz, 0, 0.14) * gaussian(scanT, 0.56, 0.16);
      const sternalNotch = -0.032 * gaussian(scanAz, 0, 0.16) * gaussian(scanT, 0.08, 0.12);

      const isNeckInterior = i % 5 === 0;
      const neckFill = isNeckInterior ? 0.65 + 0.32 * rand() : 0.96 + 0.04 * rand();
      const radX = (0.185 + trapFlare + scmRidge * 0.5) * neckFill;
      const radZ = (0.195 + (1 - scanT) * 0.06 + scmRidge + larynx + sternalNotch) * neckFill;

      bx = Math.sin(scanAz) * radX;
      by = y;
      bz = Math.cos(scanAz) * radZ;

      // Strong submental shadow under the chin/jawline (scanT > 0.68) so the bright chin projects sharply forward!
      const isUnderJaw = scanT > 0.68;
      highlightWeight = isUnderJaw ? 0.08 : scmRidge > 0.016 ? 0.78 : 0.44;
      shadowWeight = isUnderJaw ? 0.88 : sternalNotch < -0.015 ? 0.74 : 0.32;
    } else {
      // --- ZONE 5: BROAD ATHLETIC SHOULDERS, S-CURVED CLAVICLES & UPPER CHEST SCANLINES (13%) ---
      const s = Math.round(((v - 0.5) * 2) * 60) / 60;
      const absS = Math.abs(s);
      const wrapAz = (w - 0.5) * Math.PI * 1.24;

      const topRidgeY = -0.38 - Math.pow(absS, 1.30) * 0.40;
      const bottomEdgeY = -1.22 + Math.pow(absS, 1.75) * 0.22;
      const verticalT = Math.pow(rand(), 0.72);
      by = quantize(topRidgeY - verticalT * (topRidgeY - bottomEdgeY), 0.016);

      const shoulderSpan = 1.22;
      bx = quantize(s * shoulderSpan, 0.016);

      const isClavicleZone =
        verticalT < 0.22 && Math.cos(wrapAz) > 0.35 && absS > 0.06 && absS < 0.72;
      const clavicleBoost = isClavicleZone ? 0.058 : 0;
      const deltoidCap = absS > 0.68 && verticalT < 0.45 ? 0.042 : 0;

      const depthRadius =
        (0.32 * (1 - 0.30 * absS * absS) + clavicleBoost + deltoidCap) *
        (0.78 + 0.22 * rand());
      bz = Math.cos(wrapAz) * depthRadius;

      highlightWeight = isClavicleZone ? 0.92 : 0.50 + 0.25 * Math.max(0, Math.cos(wrapAz));
      shadowWeight = isClavicleZone ? 0.05 : 0.28;

      if (absS > 0.84 || verticalT > 0.84) {
        bx += (rand() - 0.5) * 0.08;
        by += (rand() - 0.5) * 0.08;
        bz += (rand() - 0.5) * 0.08;
      }
    }

    // Apply the 1.18x scale multiplier so the middle figure is slightly bigger and more commanding
    bustPositions[i3] = bx * BUST_SCALE;
    bustPositions[i3 + 1] = by * BUST_SCALE;
    bustPositions[i3 + 2] = bz * BUST_SCALE;

    // --- 2. NEURAL CORTEX MORPH TARGET ---
    if (i < count * 0.78) {
      const nTheta = v * Math.PI * 2;
      const nPhi = Math.acos(2 * w - 1);
      const rBase = 1.08 + 0.16 * Math.sin(6 * nTheta) * Math.sin(5 * nPhi);
      const hemisphereGap = Math.cos(nTheta) >= 0 ? 0.06 : -0.06;
      neuralPositions[i3] = rBase * Math.sin(nPhi) * Math.cos(nTheta) + hemisphereGap;
      neuralPositions[i3 + 1] = rBase * Math.cos(nPhi) * 0.92 + 0.05;
      neuralPositions[i3 + 2] = rBase * Math.sin(nPhi) * Math.sin(nTheta);
    } else {
      const ringAngle = v * Math.PI * 2;
      const ringRadius = 1.55 + (w - 0.5) * 0.35;
      const tilt = i % 2 === 0 ? 0.42 : -0.36;
      const rx = Math.cos(ringAngle) * ringRadius;
      const rz = Math.sin(ringAngle) * ringRadius;
      neuralPositions[i3] = rx;
      neuralPositions[i3 + 1] = rz * Math.sin(tilt) + 0.05;
      neuralPositions[i3 + 2] = rz * Math.cos(tilt);
    }

    // --- 3. ARCHITECTURE PAVILION MORPH TARGET ---
    const gx = ((i % 32) / 31 - 0.5) * 2.8;
    const gz = ((Math.floor(i / 32) % 28) / 27 - 0.5) * 2.4;
    const archHeight =
      Math.cos(gx * 1.5) * Math.cos(gz * 1.5) * 0.82 +
      (Math.abs(gx) < 0.55 && Math.abs(gz) < 0.55 ? 0.6 : -0.32);
    architecturePositions[i3] = quantize(gx + (u - 0.5) * 0.05, 0.045);
    architecturePositions[i3 + 1] = quantize(archHeight + (w - 0.5) * 0.28, 0.045);
    architecturePositions[i3 + 2] = quantize(gz + (v - 0.5) * 0.05, 0.045);

    // --- 4. RESONANT SIGNAL WAVE MORPH TARGET ---
    const wx = (u - 0.5) * 3.8;
    const wz = (v - 0.5) * 2.6;
    const dist = Math.sqrt(wx * wx + wz * wz);
    const wy =
      Math.sin(dist * 3.8 - w * 1.2) * 0.52 * Math.exp(-dist * 0.3) +
      Math.cos(wx * 2.2) * 0.2;
    wavePositions[i3] = wx;
    wavePositions[i3 + 1] = wy;
    wavePositions[i3 + 2] = wz;

    // --- SCULPTURAL DUAL-TEMPERATURE VERTEX COLORING ---
    // Protruding anatomical features (nose bridge/tip, brow, eyelids, cheekbones, lips, chin, ear helix, clavicles)
    // glow in pure warm ivory-white; recessed contours (eye sockets, nose sidewalls, nostrils, mouth line, under-jaw)
    // shade smoothly into cool sculptural periwinkle-slate so every human feature is clear without black holes!
    const normX = Math.max(-1, Math.min(1, bx / 0.85));
    const normY = Math.max(-1, Math.min(1, by / 0.95));

    const directionalWarm = Math.max(0, Math.min(1, 0.52 + normX * 0.35 - normY * 0.10));
    const warmBlend = Math.min(1, directionalWarm * 0.55 + highlightWeight * 0.65);
    const coolBlend = 1.0 - warmBlend;

    // High-contrast sculptural luminance from 0.20 (in deep eye socket / nostril / mouth line / under-jaw) to 1.00 (on nose bridge / brow / eyelids / lips / ear helix)
    const lum = Math.max(0.20, Math.min(1.0, 0.68 + highlightWeight * 0.42 - shadowWeight * 0.56));

    const rCol = (warmR * warmBlend + coolR * coolBlend * 0.72 + coreR * highlightWeight * 0.32) * lum;
    const gCol = (warmG * warmBlend + coolG * coolBlend * 0.76 + coreG * highlightWeight * 0.32) * lum;
    const bCol = (warmB * warmBlend + coolB * coolBlend * 0.96 + coreB * highlightWeight * 0.32) * Math.min(1.0, lum * 1.08);

    colors[i3] = Math.min(1, Math.max(0.18, rCol));
    colors[i3 + 1] = Math.min(1, Math.max(0.20, gCol));
    colors[i3 + 2] = Math.min(1, Math.max(0.28, bCol));

    sizes[i] = (0.86 + rand() * 1.04) * Math.max(0.55, pointSizeScale);
  }

  return {
    count,
    bustPositions,
    neuralPositions,
    architecturePositions,
    wavePositions,
    colors,
    sizes,
    phases,
  };
}

export interface AntigravityPromptOptions {
  morphMode: ParticleMorphMode;
  paletteId: LightingPaletteId;
  particleDensity: number;
  includeShaderCode: boolean;
  includeScrollChoreography: boolean;
  includePersonalData: boolean;
}

export function generateAntigravityPrompt(
  profile: PersonalProfile,
  options: AntigravityPromptOptions
): string {
  const palette = LIGHTING_PALETTES[options.paletteId] || LIGHTING_PALETTES['ivory-indigo'];
  const sections: string[] = [];

  sections.push(`# ANTIGRAVITY MASTER BUILD PROMPT — "PARTICLE SELF" FLUID 3D PERSONAL OS
Target Reference: https://motionsites.ai/?prompt=particle-self
Subject Identity: ${profile.fullName} (${profile.roleTitle})
Primary Aesthetic: High-Definition Human Anatomical 3D Point-Cloud (Sculpted Nose, Ears, Eyes, Lips & Jawline) · 1.18x Larger Figure · Lowered Middle Guy Placement · Top-Visible Headline

---

## 1. EXECUTIVE OVERVIEW & SCROLL-PINNED MAIN PAGE ARCHITECTURE
Build a scroll-driven 3D personal operating system and portfolio for **${profile.fullName}** (${profile.brandWordmark}) where **all content and telemetry cards materialize directly on the pinned main-page 3D head stage** (\`min-h-[420vh]\` scroll container with a \`sticky top-0 h-[100dvh]\` viewport):
1. **Stage 1 (0% – 24% Scroll — Top-Visible "HELLO, I'M ${profile.heroDisplayName}" Headline + Lowered, Slightly Larger Human Figure)**:
   - Place the giant hybrid sans + pixel headline \`${profile.heroGreetingPrefix} ${profile.heroPixelWord} ${profile.heroDisplayName}\` near the top of the viewport (\`top: 13%\`, \`z-index: 25\`) so the entire headline sits cleanly above the 3D head and is **100% visible, bright, and unobstructed**.
   - **Lowered Middle Guy Placement & 1.18x Larger Human Scale**: Scale the 3D human bust 1.18x larger (\`BUST_SCALE = 1.18\`, \`cameraZ = 3.08\`) while positioning him **lower on the main page (\`bustY = -0.78\` on desktop, \`-0.68\` on tablet, \`-0.56\` on phone)** so his crown stays below the top headline while his detailed human face, nose, ears, neck, and shoulders command the center stage.
   - Bottom-left manifesto (\`${profile.versionTag} · ${profile.systemSubtitle}\`, "${profile.heroStatementLine1} ${profile.heroStatementLine2} ${profile.heroStatementLine3}").
2. **Stage 2 (24% – 50% Scroll — Macro Left Fluid Voxel Face & On-Device Memory / Bio Cards)**:
   - Camera zooms in (\`z = 1.76\`) and pans the sculpted 3D particle face to the left side of the viewport (or upper half on mobile portrait screens).
   - Floating spatial cards materialize on the right side displaying **${profile.memoryStageBadge}** ("${profile.memoryStageHeadline}"), biography, and interactive engineering disciplines.
3. **Stage 3 (50% – 76% Scroll — Macro Right Fluid Voxel Face & Left-Side Telemetry Widgets)**:
   - The 3D particle face glides to the right side of the viewport (\`x = +0.64, rotY = -0.34\`).
   - Two dark spatial telemetry cards appear on the left side:
     - **Top-Left Activity & Career Bar Chart**: Purple (\`#A78BFA\`) and electric lime (\`#E2FF32\`) vertical bar chart (\`6 AM .. NOW\`, "${profile.weeklyHandledSummary}") + career timeline roles.
     - **Bottom-Left "${profile.goldenTimeTitle}" Card**: \`${profile.goldenTimePercent}\` (${profile.goldenTimeSubtitle}) with a 40-bar purple-and-lime vertical tick matrix and Selected Works quick-launch tiles.
4. **Stage 4 (76% – 100% Scroll — "${profile.quietPlaceHeadlineLine1} ${profile.quietPlaceHeadlineLine2}" Framed Monolith Showcase)**:
   - The outer viewport transitions to a stone-silver architectural frame (\`#A8A8B3\`) surrounding a centered dark rounded monolith screen (\`rounded-[28px] bg-[#050505]\`) housing the 3D particle bust, Selected Works cards, and the Antigravity Prompt Studio trigger.`);

  if (options.includeShaderCode) {
    sections.push(`## 2. PURE VOLUMETRIC FLUID POINT-CLOUD & HUMAN ANATOMY SPECIFICATION
- **Pure White Volumetric Cloud (NO Black Mannequin Inside) (\`THREE.Points\` + \`THREE.BufferGeometry\`)**:
   - Vertex Count: \`${options.particleDensity}\` luminous particles distributed via Golden-Ratio Fibonacci scanlines across a classical Loomis human head (1:1.50 width-to-height ratio), sculpted left/right ears, slender sternocleidomastoid neck, and broad shoulders.
   - **High-Definition Human Facial Anatomy**: Use analytical surface-normal shading and gradient-ascent ridge clustering to sculpt a pronounced **dorsal nose bridge, pronasale nose tip, alar nostril wings, superciliary eyebrow arches, recessed orbital eye sockets, upper/lower almond eyelid folds, cheekbones, philtrum, Cupid's bow lips, chiseled jawline, and detailed left/right ears (helix rim, antihelix, tragus, concha bowl, earlobe)**.
   - **Zero Internal Black Mannequin or Dark Holes**: Do NOT place any black spheres, cylinders, or solid mannequin occlusion meshes inside the white particles, and avoid \`1/dist\` radial repulsion holes.
- **Fluid-Style 3D Harmonic Wave Animation**:
   - Animate every particle continuously using a 3D multi-frequency harmonic curl/wave field (\`sin(y * 4.4 - t * 2.4 + phase)\`, \`cos(x * 4.0 + t * 2.0 + phase)\`, \`sin((x + z) * 3.4 - t * 2.2)\`) with feature-preserving wave dampening on facial landmarks (nose, eyes, lips, ears) so the particles flow like living liquid light while keeping human facial anatomy razor-sharp.
- Default Active Morphology: \`${options.morphMode.toUpperCase()}\` across 4 interactive morph states (\`01. Identity Bust\`, \`02. Neural Cortex\`, \`03. Architecture Grid\`, and \`04. Signal Wave\`).
- Dual-Temperature Directional Vertex Lighting (${palette.label}):
  - Warm Key Highlight (Bottom-Right & Front): \`${palette.warmHex}\`
  - Cool Rim Fill (Top-Left & Back): \`${palette.coolHex}\`
  - Volumetric Core Glow: \`${palette.coreHex}\``);
  }

  if (options.includeScrollChoreography) {
    sections.push(`## 3. SCROLL-DRIVEN CHOREOGRAPHY, FRAMER MOTION ENTRANCES & BOTTOM DOCK
- **Viewport Entrance Animations (\`motion/react\`)**:
  - Animate stage cards, telemetry widgets, 4-column proof metrics, Bento project cards, and timeline rows using \`whileInView={{ opacity: 1, y: 0 }}\` and stage-driven \`AnimatePresence\` transitions from \`initial={{ opacity: 0, y: 24 }}\`.
  - Use compositor-only properties (\`opacity\`, \`transform\`) with smooth settling curves (\`ease: [0.16, 1, 0.3, 1]\`, \`duration: 0.65\`), staggered child delays (\`staggerChildren: 0.1\`), and full \`useReducedMotion()\` compliance.
- **Collapsible Bottom Control Dock**:
  - Pin a compact horizontal control bar at \`bottom: 20px; left: 50%; transform: translateX(-50%)\` with stage jump pills, morph state buttons, dispersion slider, palette switcher, and a \`Hide Controls (H)\` zen toggle.`);
  }

  if (options.includePersonalData) {
    const projectsFormatted = profile.projects
      .map(
        (p) =>
          `  - **${p.index}. ${p.title}** (${p.category} · ${p.year} · ${p.metrics}): ${p.summary}`
      )
      .join('\n');

    const expFormatted = profile.experience
      .map(
        (e) =>
          `  - **${e.index}. ${e.role} — ${e.organization}** (${e.period} · ${e.location}): ${e.impact}`
      )
      .join('\n');

    const metricsFormatted = profile.metrics
      .map((m) => `  - **${m.value}** ${m.label} — ${m.context}`)
      .join('\n');

    sections.push(`## 4. PERSONAL INFORMATION & CONTENT PAYLOAD (SEED DATA)
- **Full Name**: ${profile.fullName}
- **Hero Display Name**: ${profile.heroDisplayName}
- **Role / Title**: ${profile.roleTitle}
- **Location**: ${profile.location}
- **Contact Email**: ${profile.email}
- **GitHub / Portfolio Link**: ${profile.githubHandle}
- **About Headline**: ${profile.aboutHeadline}
- **About Narrative**:
  "${profile.aboutLead} ${profile.aboutBody}"
- **Core Disciplines**: ${profile.disciplines.join(' · ')}
- **Key Proof Metrics**:
${metricsFormatted}
- **Selected Works (Bento Showcase)**:
${projectsFormatted}
- **Experience Timeline**:
${expFormatted}`);
  }

  sections.push(`## 5. DESIGN & CODE QUALITY CONSTRAINTS FOR ANTIGRAVITY
- Use React 19, TypeScript, Tailwind CSS, \`motion/react\`, and Three.js (\`three\`).
- Maintain strict 60-30-10 color discipline: 60% obsidian canvas (\`#050505\`), 30% structural zinc/charcoal surfaces (\`#0F0F12\`, hairline borders \`rgba(255,255,255,0.08)\`), 10% high-contrast warm ivory (\`${palette.warmHex}\`) & electric lime (\`${palette.accentHex}\`) accents.
- Render all static metadata as clean unboxed text separated by middle dots (\`·\`)—never wrap static tags or dates in rounded pill badges.
- Ensure every button, stage selector, morph selector, project card, and customizer form has a complete working handler.`);

  return sections.join('\n\n');
}
