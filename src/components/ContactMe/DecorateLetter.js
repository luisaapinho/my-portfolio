import { useEffect, useRef, useState } from "react";
import "./DecorateLetter.css";

// decoration images
const SEALS = [
  "/assets/letter/decoration/decoration-07.png",
  "/assets/letter/decoration/decoration-08.png",
  "/assets/letter/decoration/decoration-09.png",
  "/assets/letter/decoration/decoration-10.png",
];
const STAMPS = [
  "/assets/letter/decoration/decoration-05.png",
  "/assets/letter/decoration/decoration-06.png",
  "/assets/letter/decoration/decoration-01.png",
];
const FLOWERS = [
  "/assets/letter/decoration/decoration-02.png",
  "/assets/letter/decoration/decoration-03.png",
  "/assets/letter/decoration/decoration-04.png",
];
const LETTER_IMG = "/assets/letter/closed-letter.png";

// desktop max resizing limits
const DEFAULT_MIN_SCALE = 0.55;
const DEFAULT_MAX_SCALE = 3;

// mobile resizing limits
const MOBILE_MIN_SCALE = 0.35;
const MOBILE_MAX_SCALE = 2;

const MAX_DECORATIONS = 10;

const TABS = [
  { key: "seals", label: "Seals", items: () => SEALS },
  { key: "stamps", label: "Stamps", items: () => STAMPS },
  { key: "flowers", label: "Flowers", items: () => FLOWERS },
];

export default function DecorateLetter() {
  const [nameOnLetter, setNameOnLetter] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [decorations, setDecorations] = useState([]);
  const [currentTab, setCurrentTab] = useState("seals");
  const [carry, setCarry] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [minScale, setMinScale] = useState(DEFAULT_MIN_SCALE);
  const [maxScale, setMaxScale] = useState(DEFAULT_MAX_SCALE);
  const [limitReached, setLimitReached] = useState(false);
  const [draggingId, setDraggingId] = useState(null); 

  const stageRef = useRef(null);
  const trackRef = useRef(null);
  const dragState = useRef(null);
  const resizeState = useRef(null);
  const rotateState = useRef(null);

    

  // storage with debounce
  useEffect(() => {
    const saved = localStorage.getItem("decorate-letter-dnd");
    if (saved) setDecorations(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("decorate-letter-dnd", JSON.stringify(decorations));
    }, 300);
    return () => clearTimeout(timer);
  }, [decorations]);

  // esc cancels
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setCarry(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // mobile detection
  useEffect(() => {
    const checkDevice = () => {
      const isMobileDevice = window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
      setMinScale(isMobileDevice ? MOBILE_MIN_SCALE : DEFAULT_MIN_SCALE);
      setMaxScale(isMobileDevice ? MOBILE_MAX_SCALE : DEFAULT_MAX_SCALE);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const renderTrack = (items) => (
    <div className="mp-track" role="list">
      {items.map((src) => (
        <img
          role="listitem"
          key={src}
          src={src}
          alt="Decoration"
          className="pick"
          onClick={() => startCarry(src)}
          onTouchStart={() => startCarry(src)}
        />
      ))}
    </div>
  );

  const startCarry = (src) => {
    setCarry({ src, x: 0, y: 0, inside: false });
    setSelectedId(null);
  };

  const onStagePointerMove = (e) => {
    if (!carry || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCarry({ ...carry, x, y, inside: x >= 0 && y >= 0 && x <= rect.width && y <= rect.height });
  };

  const onStagePointerUp = () => {
    if (!carry || !carry.inside || !stageRef.current) return;

    if (decorations.length >= MAX_DECORATIONS) {
      setLimitReached(true);
      setTimeout(() => setLimitReached(false), 3000);
      return;
    }

    const { x, y } = carry;
    const id = crypto.randomUUID?.() || String(Date.now() + Math.random());
    setDecorations((prev) => [
      ...prev,
      { 
        id, 
        src: carry.src, 
        x, 
        y, 
        scale: 1, 
        rot: 0, 
        z: prev.length ? Math.max(...prev.map(d => d.z || 1)) + 1 : 1 
      },
    ]);
    setSelectedId(id);
    setCarry(null);
  };

  const onPointerDownMove = (e, id) => {
    if (carry) return;
    e.stopPropagation();
    setSelectedId(id);
    setDraggingId(id); 


    const rect = stageRef.current.getBoundingClientRect();
    const item = decorations.find(d => d.id === id);
    if (!item) return;
    dragState.current = {
      id,
      offsetX: e.clientX - (rect.left + item.x),
      offsetY: e.clientY - (rect.top + item.y),
    };
    window.addEventListener("pointermove", onPointerMoveStage);
    window.addEventListener("pointerup", onPointerUpStage, { once: true });
  };

  const onPointerMoveStage = (e) => {
    if (!dragState.current || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const id = dragState.current.id;
    const x = e.clientX - rect.left - dragState.current.offsetX;
    const y = e.clientY - rect.top - dragState.current.offsetY;
    setDecorations(prev =>
      prev.map(d => d.id === id ? { 
        ...d, 
        x: clamp(x, 0, rect.width), 
        y: clamp(y, 0, rect.height) 
      } : d)
    );
  };

  const onPointerUpStage = () => {
    dragState.current = null;
    setDraggingId(null); 
    window.removeEventListener("pointermove", onPointerMoveStage);
  };

  const onPointerDownResize = (e, id) => {
    if (carry) return;
    e.stopPropagation();
    const rect = stageRef.current.getBoundingClientRect();
    const item = decorations.find(d => d.id === id);
    if (!item) return;
    resizeState.current = {
      id,
      startDist: distFrom(e.clientX, e.clientY, rect.left + item.x, rect.top + item.y),
      startScale: item.scale,
      cx: rect.left + item.x,
      cy: rect.top + item.y,
    };
    window.addEventListener("pointermove", onPointerMoveResize);
    window.addEventListener("pointerup", onPointerUpResize, { once: true });
  };

  const onPointerMoveResize = (e) => {
    if (!resizeState.current) return;
    const { id, startDist, startScale, cx, cy } = resizeState.current;
    const currentDist = distFrom(e.clientX, e.clientY, cx, cy);
    const ratio = currentDist / Math.max(1, startDist);
    const nextScale = clamp(startScale * ratio, minScale, maxScale);
    setDecorations(prev => prev.map(d => d.id === id ? { ...d, scale: nextScale } : d));
  };

  const onPointerUpResize = () => {
    resizeState.current = null;
    window.removeEventListener("pointermove", onPointerMoveResize);
  };

  const onPointerDownRotate = (e, id) => {
    if (carry) return;
    e.stopPropagation();
    const rect = stageRef.current.getBoundingClientRect();
    const item = decorations.find(d => d.id === id);
    if (!item) return;
    const startAngle = angleFrom(rect.left + item.x, rect.top + item.y, e.clientX, e.clientY);
    rotateState.current = {
      id,
      startAngle,
      baseRot: item.rot,
      cx: rect.left + item.x,
      cy: rect.top + item.y,
    };
    window.addEventListener("pointermove", onPointerMoveRotate);
    window.addEventListener("pointerup", onPointerUpRotate, { once: true });
  };

  const onPointerMoveRotate = (e) => {
    if (!rotateState.current) return;
    const { id, startAngle, baseRot, cx, cy } = rotateState.current;
    const ang = angleFrom(cx, cy, e.clientX, e.clientY);
    const delta = ang - startAngle;
    setDecorations(prev => prev.map(d => d.id === id ? { ...d, rot: baseRot + delta } : d));
  };

  const onPointerUpRotate = () => {
    rotateState.current = null;
    window.removeEventListener("pointermove", onPointerMoveRotate);
  };

  const bringToFront = (id) => {
    const maxZ = decorations.length ? Math.max(...decorations.map(d => d.z || 1)) : 1;
    setDecorations(prev => prev.map(d => d.id === id ? { ...d, z: maxZ + 1 } : d));
  };

  const removeSelected = () => {
    if (!selectedId) return;
    setDecorations(prev => prev.filter(d => d.id !== selectedId));
    setSelectedId(null);
  };

  const handleDeselect = (e) => {
    if (e.target === stageRef.current) {
      setSelectedId(null);
    }
  };

  return (
    <section className="decorate-section">
      {limitReached && (
        <div className="limit-message">
          <p>You reached the max decoration limit :(</p>
        </div>
      )}

      <div className="row-name">
        <label htmlFor="nameOnLetter">Write your name:</label>
        <input
          id="nameOnLetter"
          value={nameOnLetter}
          onChange={(e) => setNameOnLetter(e.target.value)}
          placeholder="ex.: luísa pinho"
        />
      </div>

      <div className="row-seals d-desktop">
        {SEALS.map((src) => (
          <img 
            key={src} 
            src={src} 
            alt="Seal" 
            className="pick" 
            onClick={() => startCarry(src)} 
          />
        ))}
      </div>

      <div className="row-cols">
        <div className="col left-col d-desktop">
          {STAMPS.map((src) => (
            <img 
              key={src} 
              src={src} 
              alt="Stamp" 
              className="pick" 
              onClick={() => startCarry(src)} 
            />
          ))}
        </div>

        <div
          className={`stage ${carry ? "carrying" : ""}`}
          ref={stageRef}
          onPointerMove={onStagePointerMove}
          onPointerUp={onStagePointerUp}
          onPointerDown={handleDeselect}
        >
          <img src={LETTER_IMG} alt="Letter" className="stage-letter" />
          {nameOnLetter && <div className="slot-text">{nameOnLetter}</div>}

          {carry && carry.inside && (
            <img
              src={carry.src}
              alt="Decoration preview"
              className="carry-preview"
              style={{ 
                left: carry.x, 
                top: carry.y, 
                transform: "translate(-50%, -50%)" 
              }}
            />
          )}

{decorations.map((d) => (
    <div
        key={d.id}
        className={`dec-it ${selectedId === d.id ? "active" : ""} ${
        isMobile && draggingId === d.id ? "touch-dragging" : ""
        }`}
        style={{
        left: d.x,
        top: d.y,
        zIndex: draggingId === d.id ? 999 : d.z || 1, // Eleva durante o drag
        transform: `translate(-50%, -50%) rotate(${d.rot}rad) scale(${d.scale})`,
        }}
        onPointerDown={(e) => { 
        onPointerDownMove(e, d.id); 
        bringToFront(d.id); 
        }}
    >
    <img src={d.src} alt="Decoration" draggable={false} />
    {selectedId === d.id && (
      <>
        <button
          type="button"
          className="dec-remove"
          onClick={(e) => { 
            e.stopPropagation(); 
            removeSelected(); 
          }}
          aria-label="Remove decoration"
        >
          ×
        </button>
        <span 
          className="handle handle-rotate" 
          onPointerDown={(e) => onPointerDownRotate(e, d.id)} 
          aria-label="Rotate decoration"
        />
        <span 
          className="handle handle-resize" 
          onPointerDown={(e) => onPointerDownResize(e, d.id)}
          aria-label="Resize decoration"
        />
      </>
    )}
  </div>
))}
        </div>

        <div className="col right-col d-desktop">
          {FLOWERS.map((src) => (
            <img 
              key={src} 
              src={src} 
              alt="Flower" 
              className="pick" 
              onClick={() => startCarry(src)} 
            />
          ))}
        </div>
      </div>

      <div className="mobile-palette d-mobile" aria-label="Decorations">
        <div className="mp-tabs" role="tablist" aria-label="Decoration categories">
          {TABS.map(t => (
            <button
              key={t.key}
              role="tab"
              aria-selected={currentTab === t.key}
              className={`mp-tab ${currentTab === t.key ? "active" : ""}`}
              onClick={() => setCurrentTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mp-viewport">
          <button
            className="mp-arrow left"
            aria-label="Previous decorations"
            onClick={() => trackRef.current?.scrollBy({ 
              left: -Math.round(trackRef.current.clientWidth * 0.8), 
              behavior: 'smooth' 
            })}
          >
            ‹
          </button>

          <div className="mp-track-wrap" ref={trackRef}>
            {currentTab === "seals" && renderTrack(SEALS)}
            {currentTab === "stamps" && renderTrack(STAMPS)}
            {currentTab === "flowers" && renderTrack(FLOWERS)}
          </div>

          <button
            className="mp-arrow right"
            aria-label="Next decorations"
            onClick={() => trackRef.current?.scrollBy({ 
              left: Math.round(trackRef.current.clientWidth * 0.8), 
              behavior: 'smooth' 
            })}
          >
            ›
          </button>
        </div>
      </div>

      <div className="actions">
        <button 
          className="btn" 
          onClick={() => { 
            setDecorations([]); 
            setSelectedId(null); 
          }}
        >
          Clear decorations
        </button>
        {carry && (
          <span style={{ marginLeft: 12, fontSize: 14 }}>
            Tip: tap/click the letter to drop • Esc to cancel
          </span>
        )}
      </div>
    </section>
  );
}

/* helpers */
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function distFrom(x1, y1, x2, y2) { return Math.hypot(x2 - x1, y2 - y1); }
function angleFrom(cx, cy, px, py) { return Math.atan2(py - cy, px - cx); }