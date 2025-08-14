import { RoughNotation } from 'react-rough-notation';
import { useEffect, useState } from 'react';

export default function HighlightText({ children, delay = 0, active = false, noWrap = false }) {
  const [show, setShow] = useState(false);
  const [highlighted, setHighlighted] = useState(false);

  useEffect(() => {
    if (!active) return;

    const showTimer = setTimeout(() => setShow(true), delay);
    const highlightTimer = setTimeout(() => setHighlighted(true), delay + 1200);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(highlightTimer);
    };
  }, [delay, active]);

  return (
    <RoughNotation
      type="highlight"
      color="#AF431C"
      show={show}
      animationDuration={1200}
    >
      <span
        className={`${highlighted ? 'highlight-text-colored' : ''} ${noWrap ? 'highlight-no-wrap' : ''}`}
      >
        {children}
      </span>
    </RoughNotation>
  );
}
