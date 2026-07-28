'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only on devices with a fine pointer (mouse/trackpad, not touch)
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Hide until first mouse move
    dot.style.opacity = '0';
    ring.style.opacity = '0';

    const handleMouse = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      dot.style.left = x + 'px';
      dot.style.top = y + 'px';
      ring.style.left = x + 'px';
      ring.style.top = y + 'px';
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    // Activate ring on hover over interactive elements
    const activate = () => ring.classList.add('active');
    const deactivate = () => ring.classList.remove('active');

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const isInteractive = target.matches(
        'a, button, input, textarea, select, [role="button"], [role="tab"], [role="link"], label'
      );
      if (isInteractive) {
        activate();
        target.addEventListener('mouseleave', deactivate, { once: true });
      }
    };

    document.addEventListener('mousemove', handleMouse, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouse);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} id="aura-dot" aria-hidden="true" />
      <div ref={ringRef} id="aura-ring" aria-hidden="true" />
    </>
  );
}
