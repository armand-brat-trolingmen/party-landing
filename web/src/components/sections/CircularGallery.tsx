import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './CircularGallery.module.css';

type GL = Renderer['gl'];

type CircularGalleryItem = {
  image: string;
  imageWebpSrcSet?: string;
  sizes?: string;
  alt: string;
  width: number;
  height: number;
};

type CircularGalleryProps = {
  items: readonly CircularGalleryItem[];
  className?: string;
  testId?: string;
  imageFit?: 'cover' | 'contain';
  interactiveMode?: 'auto' | 'off';
  eagerImageCount?: number;
};

type GalleryMesh = {
  mesh: Mesh;
  program: Program;
};

type GalleryMetrics = {
  viewportWidth: number;
  viewportHeight: number;
  planeWidth: number;
  planeHeight: number;
  spacing: number;
  radius: number;
  verticalOffset: number;
  pixelsToWorld: number;
};

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

function wrap(value: number, min: number, max: number) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

function getPrimarySrcFromSrcSet(srcSet?: string) {
  const firstSource = srcSet?.split(',')[0]?.trim();
  if (!firstSource) {
    return null;
  }

  return firstSource.split(/\s+/)[0] ?? null;
}

function supportsInteractiveGallery() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false) {
    return false;
  }

  if (
    (window.matchMedia?.('(pointer: coarse)').matches ?? false) &&
    (window.matchMedia?.('(max-width: 900px)').matches ?? false)
  ) {
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    const contextAttributes = { failIfMajorPerformanceCaveat: true } as const;
    return Boolean(
      canvas.getContext('webgl', contextAttributes) ??
        canvas.getContext('experimental-webgl', contextAttributes),
    );
  } catch {
    return false;
  }
}

export function getMediaFragmentShader(imageFit: 'cover' | 'contain') {
  if (imageFit === 'contain') {
    return `
      precision highp float;

      uniform sampler2D tMap;
      uniform vec2 uImageSizes;
      uniform vec2 uPlaneSizes;
      varying vec2 vUv;

      vec2 containUv(vec2 uv, vec2 planeSize, vec2 imageSize) {
        float planeRatio = planeSize.x / planeSize.y;
        float imageRatio = imageSize.x / imageSize.y;
        vec2 ratio = vec2(1.0);

        if (planeRatio > imageRatio) {
          ratio.x = imageRatio / planeRatio;
        } else {
          ratio.y = planeRatio / imageRatio;
        }

        vec2 offset = (1.0 - ratio) * 0.5;

        if (
          uv.x < offset.x ||
          uv.x > offset.x + ratio.x ||
          uv.y < offset.y ||
          uv.y > offset.y + ratio.y
        ) {
          discard;
        }

        return (uv - offset) / ratio;
      }

      void main() {
        vec2 uv = containUv(vUv, uPlaneSizes, uImageSizes);
        vec4 color = texture2D(tMap, uv);
        gl_FragColor = color;
      }
    `;
  }

  return `
    precision highp float;

    uniform sampler2D tMap;
    uniform vec2 uImageSizes;
    uniform vec2 uPlaneSizes;
    varying vec2 vUv;

    vec2 coverUv(vec2 uv, vec2 planeSize, vec2 imageSize) {
      float planeRatio = planeSize.x / planeSize.y;
      float imageRatio = imageSize.x / imageSize.y;
      vec2 ratio = vec2(1.0);

      if (planeRatio > imageRatio) {
        ratio.y = imageRatio / planeRatio;
      } else {
        ratio.x = planeRatio / imageRatio;
      }

      return vec2(
        uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        uv.y * ratio.y + (1.0 - ratio.y) * 0.5
      );
    }

    void main() {
      vec2 uv = coverUv(vUv, uPlaneSizes, uImageSizes);
      vec4 color = texture2D(tMap, uv);
      gl_FragColor = color;
    }
  `;
}

function createMediaProgram(gl: GL, imageFit: 'cover' | 'contain') {
  return new Program(gl, {
    transparent: true,
    depthTest: true,
    depthWrite: false,
    vertex: `
      attribute vec3 position;
      attribute vec2 uv;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragment: getMediaFragmentShader(imageFit),
    uniforms: {
      tMap: { value: new Texture(gl, { generateMipmaps: true }) },
      uImageSizes: { value: [1, 1] },
      uPlaneSizes: { value: [1, 1] },
    },
  });
}

export function CircularGallery({
  items,
  className,
  testId = 'food-trucks-gallery',
  imageFit = 'cover',
  interactiveMode = 'auto',
  eagerImageCount = 1,
}: CircularGalleryProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const shouldShowCanvas = isInteractive && isCanvasReady;
  const rootClassName = useMemo(
    () => [styles.root, className].filter(Boolean).join(' '),
    [className],
  );

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      setIsInteractive(items.length > 0 && interactiveMode === 'auto' && supportsInteractiveGallery());
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [interactiveMode, items.length]);

  useEffect(() => {
    const stage = stageRef.current;
    let resetReadyFrameId = 0;
    let interactiveFallbackFrameId = 0;
    const scheduleCanvasReset = () => {
      resetReadyFrameId = window.requestAnimationFrame(() => {
        setIsCanvasReady(false);
      });
    };

    if (!stage || !isInteractive || items.length === 0) {
      scheduleCanvasReset();
      return () => window.cancelAnimationFrame(resetReadyFrameId);
    }
    const stageElement = stage;
    scheduleCanvasReset();

    let destroyed = false;
    let rafId = 0;
    let ticking = false;
    let pointerId: number | null = null;
    let dragVelocity = 0;
    let current = 0;
    let target = 0;
    let lastPointerX = 0;
    let isDragging = false;

    const metrics: GalleryMetrics = {
      viewportWidth: 1,
      viewportHeight: 1,
      planeWidth: 1,
      planeHeight: 1,
      spacing: 1.5,
      radius: 6,
      verticalOffset: 0,
      pixelsToWorld: 0.01,
    };

    let renderer: Renderer;

    try {
      renderer = new Renderer({
        alpha: true,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio || 1, 1.75),
        premultipliedAlpha: true,
      });
    } catch {
      interactiveFallbackFrameId = window.requestAnimationFrame(() => {
        setIsInteractive(false);
      });
      return () => window.cancelAnimationFrame(interactiveFallbackFrameId);
    }

    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.classList.add(styles.canvas);
    canvas.setAttribute('aria-hidden', 'true');
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl);
    camera.fov = 34;
    camera.position.z = 12.6;

    const scene = new Transform();
    scene.position.y = -0.08;

    const geometry = new Plane(gl);

    const galleryMeshes: GalleryMesh[] = items.map((item) => {
      const program = createMediaProgram(gl, imageFit);
      const mesh = new Mesh(gl, { geometry, program });
      mesh.setParent(scene);

      const texture = program.uniforms.tMap.value as Texture;
      const image = new window.Image();
      image.decoding = 'async';
      const preferredImageSrc = getPrimarySrcFromSrcSet(item.imageWebpSrcSet) ?? item.image;
      let hasRetriedWithFallback = false;

      image.onload = () => {
        if (destroyed) {
          return;
        }

        texture.image = image;
        program.uniforms.uImageSizes.value = [image.naturalWidth, image.naturalHeight];
        setIsCanvasReady(true);
        startLoop();
      };
      image.onerror = () => {
        if (!hasRetriedWithFallback && preferredImageSrc !== item.image) {
          hasRetriedWithFallback = true;
          image.src = item.image;
          return;
        }

        if (!destroyed) {
          setIsInteractive(false);
        }
      };
      image.src = preferredImageSrc;

      return { mesh, program };
    });

    stageElement.appendChild(canvas);

    function updateMetrics() {
      const width = Math.max(stageElement.clientWidth, 1);
      const height = Math.max(stageElement.clientHeight, 1);
      const isMobile = width <= 720;

      camera.position.z = isMobile ? 11.3 : 12.6;
      renderer.setSize(width, height);
      camera.perspective({ aspect: width / height });

      const fov = (camera.fov * Math.PI) / 180;
      const viewportHeight = 2 * Math.tan(fov / 2) * camera.position.z;
      const viewportWidth = viewportHeight * camera.aspect;
      const planeHeight = Math.min(
        viewportHeight * (isMobile ? 0.5 : 0.64),
        isMobile ? 4.2 : 5.5,
      );
      const planeWidth = planeHeight * (4 / 3);
      const spacing = planeWidth + (isMobile ? 0.62 : 0.96);

      metrics.viewportWidth = viewportWidth;
      metrics.viewportHeight = viewportHeight;
      metrics.planeWidth = planeWidth;
      metrics.planeHeight = planeHeight;
      metrics.spacing = spacing;
      metrics.radius = spacing * (isMobile ? 3.65 : 3.1);
      metrics.verticalOffset = isMobile ? -0.08 : -0.14;
      metrics.pixelsToWorld = viewportWidth / width;

      galleryMeshes.forEach(({ mesh, program }) => {
        mesh.scale.set(planeWidth, planeHeight, 1);
        program.uniforms.uPlaneSizes.value = [planeWidth, planeHeight];
      });
    }

    function positionMeshes() {
      const span = Math.max(items.length * metrics.spacing, metrics.spacing);
      const halfSpan = span / 2;

      galleryMeshes.forEach(({ mesh }, index) => {
        const offset = wrap(index * metrics.spacing - current, -halfSpan, halfSpan);
        const angle = offset / metrics.radius;

        mesh.position.x = Math.sin(angle) * metrics.radius;
        mesh.position.y = metrics.verticalOffset - Math.abs(Math.sin(angle * 0.72)) * 0.18;
        mesh.position.z = Math.cos(angle) * metrics.radius - metrics.radius;
        mesh.rotation.y = -angle * 0.96;
      });
    }

    function renderScene() {
      positionMeshes();
      renderer.render({ scene, camera });
    }

    function tick() {
      rafId = 0;

      if (destroyed) {
        ticking = false;
        return;
      }

      if (!isDragging && Math.abs(dragVelocity) > 0.0002) {
        target += dragVelocity;
        dragVelocity *= 0.92;
      } else if (!isDragging) {
        dragVelocity = 0;
      }

      const next = lerp(current, target, isDragging ? 0.22 : 0.12);
      const moving =
        isDragging ||
        Math.abs(next - current) > 0.0003 ||
        Math.abs(dragVelocity) > 0.0003;

      current = next;
      renderScene();

      if (moving) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        ticking = false;
      }
    }

    function startLoop() {
      if (destroyed || ticking) {
        return;
      }

      ticking = true;
      rafId = window.requestAnimationFrame(tick);
    }

    function handlePointerDown(event: PointerEvent) {
      if (event.pointerType === 'mouse' && event.button !== 0) {
        return;
      }

      isDragging = true;
      pointerId = event.pointerId;
      lastPointerX = event.clientX;
      dragVelocity = 0;
      stageElement.dataset.dragging = 'true';
      stageElement.setPointerCapture?.(event.pointerId);
      startLoop();
    }

    function handlePointerMove(event: PointerEvent) {
      if (!isDragging || pointerId !== event.pointerId) {
        return;
      }

      const deltaX = event.clientX - lastPointerX;
      lastPointerX = event.clientX;

      const worldDelta = deltaX * metrics.pixelsToWorld * 1.12;
      target -= worldDelta;
      dragVelocity = -worldDelta * 0.84;
      startLoop();
    }

    function releasePointer(event?: PointerEvent) {
      if (!isDragging) {
        return;
      }

      if (event && pointerId !== event.pointerId) {
        return;
      }

      if (pointerId !== null && stageElement.hasPointerCapture?.(pointerId)) {
        stageElement.releasePointerCapture(pointerId);
      }

      isDragging = false;
      pointerId = null;
      stageElement.dataset.dragging = 'false';
      startLoop();
    }

    function handleWheel(event: WheelEvent) {
      const primaryDelta = Math.abs(event.deltaX) >= Math.abs(event.deltaY) ? event.deltaX : 0;
      const fallbackDelta = event.shiftKey ? event.deltaY : 0;
      const rawDelta = primaryDelta || fallbackDelta;

      if (Math.abs(rawDelta) < 0.5) {
        return;
      }

      event.preventDefault();

      const deltaScale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stageElement.clientWidth : 1;
      const worldDelta = rawDelta * deltaScale * metrics.pixelsToWorld * 0.78;

      target += worldDelta;
      dragVelocity = worldDelta * 0.16;
      startLoop();
    }

    updateMetrics();
    renderScene();

    const resizeObserver = new ResizeObserver(() => {
      updateMetrics();
      renderScene();
    });

    resizeObserver.observe(stageElement);
    stageElement.addEventListener('pointerdown', handlePointerDown);
    stageElement.addEventListener('pointermove', handlePointerMove);
    stageElement.addEventListener('pointerup', releasePointer);
    stageElement.addEventListener('pointercancel', releasePointer);
    stageElement.addEventListener('lostpointercapture', releasePointer);
    stageElement.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      destroyed = true;
      window.cancelAnimationFrame(interactiveFallbackFrameId);
      ticking = false;
      window.cancelAnimationFrame(resetReadyFrameId);
      window.cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      stageElement.removeEventListener('pointerdown', handlePointerDown);
      stageElement.removeEventListener('pointermove', handlePointerMove);
      stageElement.removeEventListener('pointerup', releasePointer);
      stageElement.removeEventListener('pointercancel', releasePointer);
      stageElement.removeEventListener('lostpointercapture', releasePointer);
      stageElement.removeEventListener('wheel', handleWheel);
      stageElement.dataset.dragging = 'false';

      if (canvas.parentNode === stageElement) {
        stageElement.removeChild(canvas);
      }
    };
  }, [imageFit, isInteractive, items]);

  return (
    <div
      className={rootClassName}
      data-testid={testId}
      data-gallery-mode={shouldShowCanvas ? 'interactive' : 'fallback'}
    >
      <div ref={stageRef} className={styles.stage} data-dragging="false" />

      <div className={shouldShowCanvas ? styles.semanticTrackHidden : styles.semanticTrack}>
        {items.map((item, index) => (
          <figure key={item.image} className={styles.semanticCard}>
            <div className={styles.semanticPicture}>
              <img
                className={styles.semanticImage}
                data-testid="food-truck-gallery-image"
                src={item.image}
                alt={item.alt}
                width={item.width}
                height={item.height}
                loading={index < eagerImageCount ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={index === 0 ? 'high' : index < eagerImageCount ? 'auto' : 'low'}
                draggable={false}
                sizes={item.sizes}
                style={{ objectFit: imageFit }}
              />
            </div>
          </figure>
        ))}
      </div>
    </div>
  );
}
