import { useEffect, useState } from 'react';

export default function useSequentialShow(active, delay) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!active) return;

    const timer = setTimeout(() => {
      setShow(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [active, delay]);

  return show;
}
