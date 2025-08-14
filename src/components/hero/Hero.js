import { useEffect, useRef, useState } from 'react';
import { annotate } from 'rough-notation';
import './Hero.css';

export default function Hero() {
  const uxRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDrawn, setIsDrawn] = useState(false);

  const drawingRef = useRef(false);
  const hasDrawnRef = useRef(false);

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
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');

  
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const startDrawing = (e) => {
    drawingRef.current = true;
    hasDrawnRef.current = false;
    draw(e);
  };  

  const endDrawing = () => {
    drawingRef.current = false;
    ctx.beginPath();
    if (hasDrawnRef.current) {
      setIsDrawn(true);
    }
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

  //mouse events
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mouseup', endDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseleave', endDrawing);

  //touch events
  canvas.addEventListener('touchstart', startDrawing);
  canvas.addEventListener('touchend', endDrawing);
  canvas.addEventListener('touchmove', draw);
  canvas.addEventListener('touchcancel', endDrawing);


  return () => {
    canvas.removeEventListener('mousedown', startDrawing);
    canvas.removeEventListener('mouseup', endDrawing);
    canvas.removeEventListener('mousemove', draw);
    canvas.removeEventListener('mouseleave', endDrawing);

     canvas.removeEventListener('touchstart', startDrawing);
    canvas.removeEventListener('touchend', endDrawing);
    canvas.removeEventListener('touchmove', draw);
    canvas.removeEventListener('touchcancel', endDrawing);
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
      <p className="open-for-work">OPEN FOR WORK</p>

      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">Luisa Pinho</h1>
          <p className="hero-subtitle">
            <span ref={uxRef}>UI/UX DESIGNER</span> BASED ON <em>PORTO</em>
          </p>
        </div>

        <div className="hero-image-container">
          <img src="/assets/cover-site.png" alt="Luisa Pinho" className="hero-photo" />
          <button onClick={handleClearCanvas} className="draw-button">
            ({isDrawn ? 'CLEAN ME' : 'DRAW ON ME'})
          </button>
          <canvas ref={canvasRef} width={600} height={1000} className="hero-canvas" />
         
        </div>
      </div>
    </section>
  );
}
