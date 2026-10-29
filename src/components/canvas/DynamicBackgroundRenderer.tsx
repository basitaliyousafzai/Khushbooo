'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import { BackgroundScene, BackgroundLayer, AnimationPresetId } from '@/types';
import { getPublishedBackgroundScenesClient, DEFAULT_BACKGROUND_SCENES } from '@/lib/data/background-studio';

interface DynamicBackgroundRendererProps {
  targetSection?: 'hero' | 'behind_content' | 'full_section' | 'page_background';
  targetPage?: string;
  previewScene?: BackgroundScene | null; // Used by Admin Studio for live editing
  manualProgress?: number; // 0.0 to 1.0 scrubber simulator
  className?: string;
  children?: React.ReactNode;
}

export function DynamicBackgroundRenderer({
  targetSection = 'hero',
  targetPage = 'home',
  previewScene,
  manualProgress,
  className = '',
  children,
}: DynamicBackgroundRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const [activeScene, setActiveScene] = useState<BackgroundScene | null>(previewScene || null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Mutable lerp animation state for 60fps scroll synchronization
  const animState = useRef({
    currentProgress: 0,
    targetProgress: 0,
    rafId: 0,
  });

  // Load published active scene if not in preview mode
  useEffect(() => {
    if (previewScene) {
      setActiveScene(previewScene);
      return;
    }

    let isMounted = true;
    getPublishedBackgroundScenesClient(targetSection).then((scenes) => {
      if (isMounted && scenes.length > 0) {
        // Find best match for target section
        const matching = scenes.find((s) => s.target_section === targetSection) || scenes[0];
        setActiveScene(matching);
      } else if (isMounted) {
        setActiveScene(DEFAULT_BACKGROUND_SCENES[0]);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [previewScene, targetSection]);

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Synchronized Scroll Engine with Lerp Smoothing
  useEffect(() => {
    // If manualProgress is passed from Studio scrubber, track it directly
    if (typeof manualProgress === 'number') {
      animState.current.targetProgress = Math.max(0, Math.min(1, manualProgress));
    }

    const calculateScrollProgress = () => {
      if (typeof manualProgress === 'number') return;
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;

      // Calculate progress relative to container viewport visibility
      const totalScrollableDistance = rect.height + viewportHeight;
      const currentScrollPosition = viewportHeight - rect.top;

      const rawProgress = currentScrollPosition / totalScrollableDistance;
      const clamped = Math.max(0, Math.min(1, rawProgress));

      const sensitivity = activeScene?.global_settings?.scroll_sensitivity || 1.0;
      animState.current.targetProgress = clamped * sensitivity;
    };

    window.addEventListener('scroll', calculateScrollProgress, { passive: true });
    window.addEventListener('resize', calculateScrollProgress, { passive: true });
    calculateScrollProgress();

    // 60fps / 120fps requestAnimationFrame render loop with linear interpolation (Lerp)
    let isRunning = true;
    const renderLoop = () => {
      if (!isRunning) return;

      const state = animState.current;
      // Smooth lerp: advances smoothly on scroll down, reverses on scroll up, holds when stopped
      const lerpSpeed = prefersReducedMotion ? 0.04 : 0.09;
      state.currentProgress += (state.targetProgress - state.currentProgress) * lerpSpeed;

      const p = state.currentProgress;

      // Update layer transforms directly via DOM refs (Zero React re-renders)
      if (activeScene && activeScene.layers) {
        const globalSettings = activeScene.global_settings || {
          depth_intensity: 1.0,
          rotation_intensity: 0.5,
          movement_intensity: 1.0,
          speed: 1.0,
        };

        activeScene.layers.forEach((layer) => {
          const el = layerRefs.current.get(layer.id);
          if (!el) return;

          if (prefersReducedMotion) {
            // Accessible reduced motion fallback
            el.style.transform = `translate3d(${layer.position_x}%, ${layer.position_y}%, 0) scale(${layer.scale})`;
            el.style.opacity = `${layer.opacity}`;
            return;
          }

          // Calculate progression within layer's scroll range
          const start = layer.scroll_start ?? 0;
          const end = layer.scroll_end ?? 1;
          const layerP = Math.max(0, Math.min(1, (p - start) / (end - start || 1)));

          // Movement delta based on direction and depth factor
          const moveMult = (layer.parallax_factor || 1.0) * globalSettings.movement_intensity * 80;
          let deltaX = 0;
          let deltaY = 0;
          let rotZ = layer.rotation || 0;
          let scaleVal = layer.scale || 1.0;

          switch (layer.movement_direction) {
            case 'up':
              deltaY = -layerP * moveMult;
              break;
            case 'down':
              deltaY = layerP * moveMult;
              break;
            case 'left':
              deltaX = -layerP * moveMult;
              break;
            case 'right':
              deltaX = layerP * moveMult;
              break;
            case 'depth_zoom':
              scaleVal = (layer.scale || 1.0) + layerP * 0.25 * globalSettings.depth_intensity;
              deltaY = -layerP * moveMult * 0.4;
              break;
            case 'orbit':
              deltaX = Math.sin(layerP * Math.PI * 2) * moveMult * 0.5;
              deltaY = Math.cos(layerP * Math.PI * 2) * moveMult * 0.5;
              rotZ += layerP * 45 * globalSettings.rotation_intensity;
              break;
            case 'float':
            default:
              deltaY = Math.sin(layerP * Math.PI * 3) * 20 * (layer.parallax_factor || 1);
              deltaX = Math.cos(layerP * Math.PI * 2) * 12 * (layer.parallax_factor || 1);
              rotZ += (layerP - 0.5) * 15 * globalSettings.rotation_intensity;
              break;
          }

          // Preset-specific mathematical modulations
          if (activeScene.preset === 'perspective-zoom') {
            scaleVal = (layer.scale || 1.0) * (1 + layerP * 0.4);
          } else if (activeScene.preset === 'rotating-3d') {
            rotZ += layerP * 90 * globalSettings.rotation_intensity;
          } else if (activeScene.preset === 'scroll-reveal') {
            scaleVal = Math.min(1.0, 0.7 + layerP * 0.35);
          }

          const depthZ = (layer.depth || 0) * globalSettings.depth_intensity * 120;
          const finalX = `calc(${layer.position_x}% + ${deltaX}px)`;
          const finalY = `calc(${layer.position_y}% + ${deltaY}px)`;

          el.style.transform = `translate3d(${finalX}, ${finalY}, ${depthZ}px) rotate(${rotZ}deg) scale(${scaleVal})`;

          // Opacity mapping
          let opacityVal = layer.opacity ?? 0.8;
          if (activeScene.preset === 'scroll-reveal') {
            opacityVal = Math.min(1, layerP * 1.4 * (layer.opacity ?? 0.8));
          }
          el.style.opacity = `${opacityVal}`;
        });
      }

      state.rafId = requestAnimationFrame(renderLoop);
    };

    animState.current.rafId = requestAnimationFrame(renderLoop);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animState.current.rafId);
      window.removeEventListener('scroll', calculateScrollProgress);
      window.removeEventListener('resize', calculateScrollProgress);
    };
  }, [activeScene, manualProgress, prefersReducedMotion]);

  if (!activeScene || !activeScene.layers || activeScene.layers.length === 0) {
    return <>{children}</>;
  }

  const globalSettings = activeScene.global_settings || {
    opacity: 0.85,
    blur: 0,
    blend_mode: 'normal',
  };

  return (
    <div
      ref={containerRef}
      className={className ? className : 'relative w-full overflow-hidden'}
      style={{
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      {/* Dynamic 3D Layer Stack (Behind Content) */}
      <div
        className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
        style={{
          opacity: globalSettings.opacity ?? 0.85,
          filter: globalSettings.blur ? `blur(${globalSettings.blur}px)` : 'none',
          mixBlendMode: globalSettings.blend_mode || 'normal',
        }}
      >
        {activeScene.layers.map((layer) => {
          // Responsive visibility filters
          const hideOnMobile = !layer.visible_mobile ? 'hidden sm:block' : '';
          const hideOnTablet = !layer.visible_tablet ? 'sm:hidden md:block' : '';

          return (
            <div
              key={layer.id}
              ref={(el) => {
                if (el) layerRefs.current.set(layer.id, el);
                else layerRefs.current.delete(layer.id);
              }}
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 will-change-transform ${hideOnMobile} ${hideOnTablet}`}
              style={{
                mixBlendMode: layer.blend_mode || 'normal',
                filter: layer.blur ? `blur(${layer.blur}px)` : 'none',
              }}
            >
              {layer.image_url ? (
                <div
                  className="relative w-full h-full max-w-[1200px] max-h-[800px]"
                  style={{
                    transformOrigin: 'center center',
                  }}
                >
                  <Image
                    src={layer.image_url}
                    alt={layer.name || 'Animated Background Layer'}
                    fill
                    sizes="100vw"
                    priority={layer.depth < 0} // Prioritize background layers
                    className={`object-contain transition-all duration-300 ${
                      layer.layer_type === 'background' ? 'object-cover' : 'object-contain'
                    }`}
                  />
                </div>
              ) : (
                // Fallback procedural visual glow
                <div
                  className="w-96 h-96 rounded-full bg-gold/15 blur-3xl"
                  style={{
                    transformOrigin: 'center center',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Public Page / Section Children Content (Elevated above background at z-10) */}
      {children && (
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      )}
    </div>
  );
}
