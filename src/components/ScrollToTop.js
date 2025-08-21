// components/ScrollToTop.js
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/** Scroll to top only when navigating into /projects */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (!prevPath.current.startsWith("/projects") && pathname.startsWith("/projects")) {
      window.scrollTo(0, 0);
    }
    prevPath.current = pathname;
  }, [pathname]);

  return null;
}
