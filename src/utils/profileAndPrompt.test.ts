import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_MORPH_MODES,
  ALL_SCATTER_ANIMATION_TYPES,
  createSeededRandom,
  DEFAULT_LAZIZXON_PROFILE,
  LIGHTING_PALETTES,
  pickRandomParticlePreset,
  validateProfileInput,
  generateParticleSelfBuffers,
  generateAntigravityPrompt,
  computeScrollCameraPose,
} from './profileAndPrompt';

test('validateProfileInput accepts valid personal profile data', () => {
  const res = validateProfileInput({
    fullName: DEFAULT_LAZIZXON_PROFILE.fullName,
    heroDisplayName: DEFAULT_LAZIZXON_PROFILE.heroDisplayName,
    roleTitle: DEFAULT_LAZIZXON_PROFILE.roleTitle,
    email: DEFAULT_LAZIZXON_PROFILE.email,
    aboutLead: DEFAULT_LAZIZXON_PROFILE.aboutLead,
  });
  assert.equal(res.valid, true);
  assert.equal(Object.keys(res.errors).length, 0);
});

test('validateProfileInput rejects empty or invalid required inputs without silent fallbacks', () => {
  const res = validateProfileInput({
    fullName: ' ',
    heroDisplayName: '',
    roleTitle: 'AI',
    email: 'invalid-email',
    aboutLead: 'Too short',
  });
  assert.equal(res.valid, false);
  assert.ok(res.errors.fullName);
  assert.ok(res.errors.heroDisplayName);
  assert.ok(res.errors.roleTitle);
  assert.ok(res.errors.email);
  assert.ok(res.errors.aboutLead);
});

test('computeScrollCameraPose transitions smoothly across all 4 reference stages on desktop, tablet, and phone aspects', () => {
  const stage0 = computeScrollCameraPose(0.05);
  assert.equal(stage0.activeStage, 0);
  assert.equal(stage0.monolithFrameProgress, 0);
  assert.ok(stage0.bustY <= -0.7, 'Stage 0 positions the middle guy lower so top headline is fully visible');

  const stage1 = computeScrollCameraPose(0.45);
  assert.equal(stage1.activeStage, 1);
  assert.ok(stage1.bustX < -0.35, 'Stage 1 pans bust to the left for macro close-up');
  assert.ok(stage1.cameraZ < 2.1, 'Stage 1 zooms camera in');

  const stage2 = computeScrollCameraPose(0.72);
  assert.equal(stage2.activeStage, 2);
  assert.ok(stage2.bustX > 0.35, 'Stage 2 pans bust to the right for macro close-up');

  const stage3 = computeScrollCameraPose(0.98);
  assert.equal(stage3.activeStage, 3);
  assert.ok(stage3.monolithFrameProgress > 0.9, 'Stage 3 activates framed monolith window');

  // Phone portrait aspect (390x844 -> 0.462) keeps head closer to horizontal center and upper half
  const phoneStage1 = computeScrollCameraPose(0.45, 390 / 844);
  assert.equal(phoneStage1.activeStage, 1);
  assert.ok(Math.abs(phoneStage1.bustX) < 0.25, 'Phone Stage 1 keeps head within narrow portrait width');
  assert.ok(phoneStage1.bustY > 0.1, 'Phone Stage 1 elevates head into upper half above docked card');
  assert.ok(phoneStage1.cameraZ > stage1.cameraZ, 'Phone Stage 1 pulls camera back to prevent clipping');

  // Tablet aspect (820x1000 -> 0.82) uses intermediate framing
  const tabletStage2 = computeScrollCameraPose(0.72, 0.9);
  assert.equal(tabletStage2.activeStage, 2);
  assert.ok(tabletStage2.bustX > 0.3 && tabletStage2.bustX < stage2.bustX);
});

test('generateParticleSelfBuffers produces finite 3D coordinates and bright non-black vertex colors across all 4 morph targets', () => {
  const count = 1200;
  const buffers = generateParticleSelfBuffers(count, LIGHTING_PALETTES['ivory-indigo'], 42);

  assert.equal(buffers.count, count);
  assert.equal(buffers.bustPositions.length, count * 3);
  assert.equal(buffers.neuralPositions.length, count * 3);
  assert.equal(buffers.architecturePositions.length, count * 3);
  assert.equal(buffers.wavePositions.length, count * 3);
  assert.equal(buffers.colors.length, count * 3);

  for (let i = 0; i < count * 3; i++) {
    assert.ok(Number.isFinite(buffers.bustPositions[i]), `bustPositions[${i}] must be finite`);
    assert.ok(Number.isFinite(buffers.neuralPositions[i]), `neuralPositions[${i}] must be finite`);
    assert.ok(
      Number.isFinite(buffers.architecturePositions[i]),
      `architecturePositions[${i}] must be finite`
    );
    assert.ok(Number.isFinite(buffers.wavePositions[i]), `wavePositions[${i}] must be finite`);
    assert.ok(
      buffers.colors[i] >= 0.18 && buffers.colors[i] <= 1,
      `colors[${i}] must be in [0.18, 1], got ${buffers.colors[i]}`
    );
  }
});

test('pickRandomParticlePreset selects valid random morph modes, scatter animation types, dispersion, and distinct next states', () => {
  const rng = createSeededRandom(99);
  let prev = pickRandomParticlePreset(undefined, undefined, rng);
  for (let i = 0; i < 20; i++) {
    const next = pickRandomParticlePreset(prev.morphMode, prev.scatterType, rng);
    assert.ok(ALL_MORPH_MODES.includes(next.morphMode));
    assert.ok(ALL_SCATTER_ANIMATION_TYPES.includes(next.scatterType));
    assert.notEqual(next.morphMode, prev.morphMode, 'Must pick a new distinct morphMode each time');
    assert.notEqual(
      next.scatterType,
      prev.scatterType,
      'Must pick a new distinct scatterType each time'
    );
    assert.ok(next.dispersion >= 0.02 && next.dispersion <= 0.6);
    assert.ok(next.seed >= 1000);
    prev = next;
  }
});

test('DEFAULT_LAZIZXON_PROFILE & generateAntigravityPrompt embed Lazizbek identity, 2023-2025-2026 roadmap, and 4 programming languages', () => {
  assert.equal(DEFAULT_LAZIZXON_PROFILE.heroDisplayName, 'LAZIZBEK');
  assert.equal(DEFAULT_LAZIZXON_PROFILE.fullName, 'Lazizbek Ibrohimjonov');
  assert.equal(DEFAULT_LAZIZXON_PROFILE.programmingLanguages.length, 4);

  const langNames = DEFAULT_LAZIZXON_PROFILE.programmingLanguages.map((l) => l.name);
  assert.deepEqual(langNames, ['JavaScript', 'Python', 'Full-Stack', 'C++']);
  const cppLang = DEFAULT_LAZIZXON_PROFILE.programmingLanguages[3];
  assert.equal(cppLang.isLearning, true);
  assert.ok(cppLang.status.includes('In Process of Learning'));

  const prompt = generateAntigravityPrompt(DEFAULT_LAZIZXON_PROFILE, {
    morphMode: 'bust',
    paletteId: 'ivory-indigo',
    particleDensity: 18000,
    includeShaderCode: true,
    includeScrollChoreography: true,
    includePersonalData: true,
  });

  assert.ok(prompt.includes('Lazizbek Ibrohimjonov'));
  assert.ok(prompt.includes("HELLO, I'M LAZIZBEK"));
  assert.ok(prompt.includes('Specialized School in Fergana'));
  assert.ok(prompt.includes('International House Tashkent'));
  assert.ok(prompt.includes('INHA University in Tashkent'));
  assert.ok(prompt.includes('THREE.Points'));
  assert.ok(prompt.includes('Pure White Volumetric Cloud (NO Black Mannequin Inside)'));
  assert.ok(prompt.includes('Lowered Middle Guy Placement'));
  assert.ok(prompt.includes('Fluid-Style 3D Harmonic Wave Animation'));
});

