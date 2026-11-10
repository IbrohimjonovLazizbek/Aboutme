import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  computeScrollCameraPose,
  LightingPaletteId,
  LIGHTING_PALETTES,
  ParticleMorphMode,
  ScatterAnimationType,
  generateParticleSelfBuffers,
} from '../utils/profileAndPrompt';

interface ParticleSelfCanvasProps {
  morphMode: ParticleMorphMode;
  scatterType: ScatterAnimationType;
  paletteId: LightingPaletteId;
  dispersion: number;
  seed: number;
  scrollProgress: number;
}

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
const PARTICLE_COUNT = isMobile ? 16000 : 26000;
const PARTICLE_SIZE = isMobile ? 0.036 : 0.030;

// Pre-allocated module-scope math scratch objects (Zero-GC render loop)
const _pointerVec = new THREE.Vector3();

function createFluidParticleSpriteTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 64, 64);
    // Crisp-core luminous fluid droplet sprite for high-definition 3D facial contours
    const grad = ctx.createRadialGradient(32, 32, 6, 32, 32, 28);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.65, 'rgba(255, 253, 248, 0.95)');
    grad.addColorStop(0.88, 'rgba(235, 240, 255, 0.45)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(6, 6, 52, 52, 16);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

export const ParticleSelfCanvas: React.FC<ParticleSelfCanvasProps> = ({
  morphMode,
  scatterType,
  paletteId,
  dispersion,
  seed,
  scrollProgress,
}) => {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);

  const stateRef = useRef({
    morphMode,
    scatterType,
    paletteId,
    dispersion,
    seed,
    scrollProgress,
  });

  useEffect(() => {
    stateRef.current = {
      morphMode,
      scatterType,
      paletteId,
      dispersion,
      seed,
      scrollProgress,
    };
  }, [morphMode, scatterType, paletteId, dispersion, seed, scrollProgress]);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    const initialPose = computeScrollCameraPose(
      stateRef.current.scrollProgress,
      width / Math.max(1, height)
    );
    camera.position.set(0, -0.04, initialPose.cameraZ);
    camera.lookAt(0, -0.08, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'mediump',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Pure volumetric point-cloud group — NO black mannequin or internal occlusion mesh
    const actorGroup = new THREE.Group();
    actorGroup.position.set(initialPose.bustX, initialPose.bustY, initialPose.bustZ);
    actorGroup.rotation.set(initialPose.bustRotX, initialPose.bustRotY, 0);
    scene.add(actorGroup);

    const initialPalette = LIGHTING_PALETTES[stateRef.current.paletteId];
    let activePaletteId = stateRef.current.paletteId;
    let activeSeed = stateRef.current.seed;
    let buffers = generateParticleSelfBuffers(PARTICLE_COUNT, initialPalette, activeSeed);

    const getTargetForMode = (mode: ParticleMorphMode) => {
      if (mode === 'neural') return buffers.neuralPositions;
      if (mode === 'architecture') return buffers.architecturePositions;
      if (mode === 'wave') return buffers.wavePositions;
      return buffers.bustPositions;
    };

    const currentPositions = new Float32Array(getTargetForMode(stateRef.current.morphMode));
    const geometry = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(currentPositions, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute('position', posAttr);

    const colorAttr = new THREE.BufferAttribute(new Float32Array(buffers.colors), 3);
    geometry.setAttribute('color', colorAttr);

    const voxelTexture = createFluidParticleSpriteTexture(
      Math.min(renderer.capabilities.getMaxAnisotropy(), 4)
    );

    const pointsMaterial = new THREE.PointsMaterial({
      size: PARTICLE_SIZE,
      map: voxelTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.94,
      alphaTest: 0.06,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const particleSystem = new THREE.Points(geometry, pointsMaterial);
    particleSystem.frustumCulled = false;
    actorGroup.add(particleSystem);

    renderer.compile(scene, camera);

    let targetPointerX = 0;
    let targetPointerY = 0;
    let smoothPointerX = 0;
    let smoothPointerY = 0;
    let pointerActive = false;

    // Cache canvas client rect to eliminate getBoundingClientRect layout thrashing on pointermove
    let cachedRect = { left: 0, top: 0, width, height };
    const updateCachedRect = () => {
      if (!renderer.domElement) return;
      const r = renderer.domElement.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        cachedRect = { left: r.left, top: r.top, width: r.width, height: r.height };
      }
    };
    updateCachedRect();

    const onPointerMove = (e: PointerEvent) => {
      if (cachedRect.width === 0 || cachedRect.height === 0) return;
      targetPointerX = ((e.clientX - cachedRect.left) / cachedRect.width) * 2 - 1;
      targetPointerY = -((e.clientY - cachedRect.top) / cachedRect.height) * 2 + 1;
      pointerActive = true;
    };

    const onPointerLeave = () => {
      pointerActive = false;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave, { passive: true });
    window.addEventListener('scroll', updateCachedRect, { passive: true });

    const onResize = () => {
      if (!container) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
      updateCachedRect();
    };
    window.addEventListener('resize', onResize, { passive: true });

    let frameId = 0;
    let isDisposed = false;
    const clock = new THREE.Clock();

    function tick() {
      if (isDisposed) return;
      const dt = Math.min(clock.getDelta(), 0.12);
      const elapsed = clock.getElapsedTime();
      const {
        morphMode: mode,
        scatterType: sType,
        paletteId: palId,
        dispersion: disp,
        seed: nextSeed,
        scrollProgress: scrollP,
      } = stateRef.current;

      if (palId !== activePaletteId || nextSeed !== activeSeed) {
        activePaletteId = palId;
        activeSeed = nextSeed;
        const nextPalette = LIGHTING_PALETTES[palId] || LIGHTING_PALETTES['ivory-indigo'];
        buffers = generateParticleSelfBuffers(PARTICLE_COUNT, nextPalette, activeSeed);
        colorAttr.copyArray(buffers.colors);
        colorAttr.needsUpdate = true;
      }

      // Compute scroll-driven 3D camera & bust choreography pose adapted to current viewport aspect
      const pose = computeScrollCameraPose(scrollP, camera.aspect);

      const targetArray = getTargetForMode(mode);

      if (!pointerActive) {
        // Continuous fluid figure-8 orbit & breathing motion when idle
        targetPointerX = Math.sin(elapsed * 0.85) * 0.18;
        targetPointerY = Math.cos(elapsed * 0.65) * 0.1;
      }
      smoothPointerX = THREE.MathUtils.damp(smoothPointerX, targetPointerX, 4.5, dt);
      smoothPointerY = THREE.MathUtils.damp(smoothPointerY, targetPointerY, 4.5, dt);

      _pointerVec.set(
        smoothPointerX * 1.35 - actorGroup.position.x,
        smoothPointerY * 1.15 - actorGroup.position.y,
        0.38
      );

      const posArr = posAttr.array as Float32Array;
      const phases = buffers.phases;
      // Silky spring interpolation for fluid trailing motion
      const lerpFactor = 1 - Math.exp(-5.4 * dt);
      const dispAmount = Math.max(0, disp);
      const e16 = elapsed * 1.6;
      const breathPulse = 1 + Math.sin(e16) * 0.015;
      const baseFluidAmp = 0.015 + dispAmount * 0.065;
      const facialFluidAmp = baseFluidAmp * 0.24;
      const nonFacialFluidAmp = baseFluidAmp * 1.12;

      // Pre-hoisted time multipliers to avoid 200,000+ redundant calculations per frame
      const e12 = elapsed * 1.2;
      const e155 = elapsed * 1.55;
      const e18 = elapsed * 1.8;
      const e20 = elapsed * 2.0;
      const e21 = elapsed * 2.1;
      const e22 = elapsed * 2.2;
      const e24 = elapsed * 2.4;
      const e26 = elapsed * 2.6;
      const e30 = elapsed * 3.0;
      const e34 = elapsed * 3.4;
      const e36 = elapsed * 3.6;
      const e38 = elapsed * 3.8;
      const e50 = elapsed * 5.0;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const phase = phases[i];

        let tx = targetArray[i3] * breathPulse;
        let ty = targetArray[i3 + 1] * breathPulse;
        let tz = targetArray[i3 + 2] * breathPulse;

        // Preserve razor-sharp anatomical detail on the face & ears while flowing lushly on hair, neck & shoulders
        const isFacialFeature =
          mode === 'bust' && Math.abs(tx) < 0.66 && ty > -0.16 && ty < 0.86 && tz > -0.12;
        const localFluidAmp = isFacialFeature ? facialFluidAmp : nonFacialFluidAmp;
        const swirlScale = isFacialFeature ? 0.32 : 1.0;

        // 4 Distinct Randomized Scatter & Flow Animation Styles:
        if (sType === 'vortex') {
          // 1. VORTEX SPIRAL: Helical orbital tornado swirl + vertical wave lift
          const vortexAngle =
            (0.18 + dispAmount * 0.72) *
            swirlScale *
            Math.sin(e155 + ty * 2.6 + phase * 0.5);
          const cosV = Math.cos(vortexAngle);
          const sinV = Math.sin(vortexAngle);
          const rx = tx * cosV - tz * sinV;
          const rz = tx * sinV + tz * cosV;
          const radialFlare = 1 + dispAmount * 0.30 * swirlScale * Math.cos(phase + e18);
          tx = rx * radialFlare;
          tz = rz * radialFlare;
          ty += Math.sin(e22 + phase) * localFluidAmp * 1.35;
        } else if (sType === 'pulse') {
          // 2. QUANTUM PULSE: Rhythmic radial shockwave expansion from center
          const distFromCore = Math.sqrt(tx * tx + ty * ty + tz * tz) + 0.001;
          const shockwave =
            Math.sin(distFromCore * 6.5 - e34 + phase * 0.35) *
            (0.022 + dispAmount * 0.16) *
            swirlScale;
          tx += (tx / distFromCore) * shockwave;
          ty += (ty / distFromCore) * shockwave;
          tz += (tz / distFromCore) * shockwave;
        } else if (sType === 'cascade') {
          // 3. VOXEL CASCADE: Digital scanline shimmer & vertical matrix stream
          const bandShift =
            Math.sin(Math.round(ty * 18) * 1.7 + e30 + phase) *
            (0.018 + dispAmount * 0.14) *
            swirlScale;
          const verticalDrift =
            Math.cos(tx * 7.0 - e26 + phase) * (0.016 + dispAmount * 0.11) * swirlScale;
          tx += bandShift;
          ty += verticalDrift;
          tz += Math.sin(tx * 5.2 + e22 + phase) * localFluidAmp;
        } else {
          // 4. FLUID CURL (Default): 3D Multi-Frequency Harmonic Fluid Flow Field
          const waveX =
            Math.sin(ty * 4.4 - e24 + phase) * 0.65 +
            Math.cos(tz * 3.8 + e18 + phase * 0.5) * 0.35;
          const waveY =
            Math.cos(tx * 4.0 + e20 + phase * 0.8) * 0.6 +
            Math.sin((tx + tz) * 3.4 - e22 + phase) * 0.4;
          const waveZ =
            Math.sin(tx * 4.2 - e21 + phase * 1.2) * 0.6 +
            Math.cos(ty * 3.6 + e16 + phase) * 0.4;

          tx += waveX * localFluidAmp;
          ty += waveY * localFluidAmp;
          tz += waveZ * localFluidAmp;

          if (dispAmount > 0.02) {
            const swirlAngle = dispAmount * 0.32 * swirlScale * Math.sin(e12 + phase);
            const cosS = Math.cos(swirlAngle);
            const sinS = Math.sin(swirlAngle);
            const rx = tx * cosS - tz * sinS;
            const rz = tx * sinS + tz * cosS;
            const radialOut =
              1 + dispAmount * 0.24 * swirlScale * (0.5 + 0.5 * Math.sin(phase + elapsed));
            tx = rx * radialOut;
            tz = rz * radialOut;
          }
        }

        // Smooth, zero-hole Gaussian fluid wave ripple when pointer is active
        if (pointerActive) {
          const dx = tx - _pointerVec.x;
          const dy = ty - _pointerVec.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 0.45) {
            const dist = Math.sqrt(distSq);
            const falloff = Math.exp(-distSq * 6.5);
            const ripple = Math.sin(dist * 14.0 - e50) * 0.032 * falloff;
            tx += (-dy * 0.22 + dx * 0.14) * falloff + ripple;
            ty += (dx * 0.22 + dy * 0.14) * falloff + ripple;
            tz += falloff * 0.085 + ripple;
          }
        }

        posArr[i3] += (tx - posArr[i3]) * lerpFactor;
        posArr[i3 + 1] += (ty - posArr[i3 + 1]) * lerpFactor;
        posArr[i3 + 2] += (tz - posArr[i3 + 2]) * lerpFactor;
      }

      posAttr.needsUpdate = true;

      // Smoothly damp actorGroup position & rotation to match the scroll stage pose + fluid breathing sway
      const poseDamp = isSoftwareGl ? 14.0 : 5.5;
      actorGroup.position.x = THREE.MathUtils.damp(
        actorGroup.position.x,
        pose.bustX,
        poseDamp,
        dt
      );
      actorGroup.position.y = THREE.MathUtils.damp(
        actorGroup.position.y,
        pose.bustY + Math.sin(elapsed * 1.3) * 0.02,
        poseDamp,
        dt
      );
      actorGroup.position.z = THREE.MathUtils.damp(
        actorGroup.position.z,
        pose.bustZ,
        poseDamp,
        dt
      );

      const desiredRotY =
        pose.bustRotY +
        smoothPointerX * 0.18 +
        Math.sin(elapsed * 0.9) * 0.06 +
        (mode === 'bust' ? 0 : elapsed * 0.15);
      const desiredRotX =
        pose.bustRotX - smoothPointerY * 0.09 + Math.cos(elapsed * 0.75) * 0.025;

      actorGroup.rotation.y = THREE.MathUtils.damp(
        actorGroup.rotation.y,
        desiredRotY,
        poseDamp,
        dt
      );
      actorGroup.rotation.x = THREE.MathUtils.damp(
        actorGroup.rotation.x,
        desiredRotX,
        poseDamp,
        dt
      );

      camera.position.z = THREE.MathUtils.damp(
        camera.position.z,
        pose.cameraZ,
        poseDamp,
        dt
      );

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', updateCachedRect);

      geometry.dispose();
      pointsMaterial.dispose();
      voxelTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={canvasMountRef}
      data-testid="particle-self-canvas"
      aria-label="Interactive 3D Particle Self Portrait Canvas"
      className="w-full h-full touch-pan-y"
    />
  );
};
