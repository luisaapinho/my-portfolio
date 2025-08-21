import { useEffect, useRef, useState } from 'react';
import { annotate } from 'rough-notation';
import './Hero.css';

export default function Hero() {
  const uxRef = useRef(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDrawn, setIsDrawn] = useState(false);

  const drawingRef = useRef(false);
  const hasDrawnRef = useRef(false);

  // RoughNotation
  useEffect(() => {
    const annotation = annotate(uxRef.current, {
      type: 'circle',
      color: '#AF431C',
      padding: 6,
      animationDuration: 800,
    });
    annotation.show();
  }, []);

  useEffect(() => {
    const img = imgRef.current;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Ensures the container matches the rendered image height (with optional bleed to guarantee coverage)
    const syncContainerToImage = () => {
      if (!img || !container) return;
      const bleed = 0.7; // 2% taller on purpose to cover the whole image area
      const containerWidth = container.clientWidth || window.innerWidth;

      // If natural sizes are available, use exact aspect ratio; otherwise fallback to current rect
      if (img.naturalWidth && img.naturalHeight) {
        const ratio = img.naturalHeight / img.naturalWidth;
        const targetHeight = Math.round(containerWidth * ratio * bleed);
        container.style.height = `${targetHeight}px`;
      } else {
        const rect = img.getBoundingClientRect();
        container.style.height = `${Math.round(rect.height * bleed)}px`;
      }
    };

    // Resize canvas internal buffer to match the container size and devicePixelRatio
    const resizeCanvasBuffer = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      // Set canvas CSS size to fill container (safety in case CSS didn’t apply yet)
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      // Internal buffer
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      // Normalize drawing units to CSS pixels
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const syncAll = () => {
      syncContainerToImage();
      resizeCanvasBuffer();
    };

    // Run once
    syncAll();

    // Sync on image load (first time and when cache not ready)
    const onImgLoad = () => syncAll();
    if (img) {
      if (img.complete) onImgLoad();
      else img.addEventListener('load', onImgLoad);
    }

    // Sync on resize/orientation
    const onResize = () => syncAll();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

    // Observe container size changes
    const ro = new ResizeObserver(syncAll);
    ro.observe(container);

    // Drawing logic
    const startDrawing = (e) => {
      drawingRef.current = true;
      hasDrawnRef.current = false;
      draw(e);
    };

    const endDrawing = () => {
      drawingRef.current = false;
      ctx.beginPath();
      if (hasDrawnRef.current) setIsDrawn(true);
    };

    const draw = (e) => {
      if (!drawingRef.current) return;
      if (e.cancelable) e.preventDefault();

      const rect = canvas.getBoundingClientRect();
      let x, y;
      if (e.touches && e.touches.length > 0) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }

      hasDrawnRef.current = true;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#AF431C';
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', endDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseleave', endDrawing);

    // Touch events (passive:false to allow preventDefault)
    const opts = { passive: false };
    canvas.addEventListener('touchstart', startDrawing, opts);
    canvas.addEventListener('touchend', endDrawing, opts);
    canvas.addEventListener('touchmove', draw, opts);
    canvas.addEventListener('touchcancel', endDrawing, opts);

    // Cleanup
    return () => {
      if (img) img.removeEventListener('load', onImgLoad);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      ro.disconnect();

      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mouseup', endDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseleave', endDrawing);

      canvas.removeEventListener('touchstart', startDrawing, opts);
      canvas.removeEventListener('touchend', endDrawing, opts);
      canvas.removeEventListener('touchmove', draw, opts);
      canvas.removeEventListener('touchcancel', endDrawing, opts);
    };
  }, []);

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsDrawn(false);
    hasDrawnRef.current = false;
  };

  return (
    <section className="hero-section">
      <p className="open-for-work">OPEN TO WORK</p>

      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">Luisa Pinho</h1>
          <p className="hero-subtitle">
            <span ref={uxRef}>UI/UX DESIGNER</span> BASED ON <em>PORTO</em>
          </p>
        </div>

        {/* Container that both image and canvas will fill */}
        <div className="hero-image-container" ref={containerRef}>
          <img
            ref={imgRef}
            src="/assets/cover-site.png"
            alt="Luisa Pinho"
            className="hero-photo"
          />
          <button onClick={handleClearCanvas} className="draw-button">
            ({isDrawn ? 'CLEAN ME' : 'DRAW ON ME'})
          </button>
          <canvas ref={canvasRef} className="hero-canvas" />
        </div>
      </div>
    </section>
  );
}
