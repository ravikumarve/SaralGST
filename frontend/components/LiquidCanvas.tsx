'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function LiquidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const isHQ = pathname.startsWith('/hq');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isHQ) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w: number, h: number;
    let time = 0;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let animationId: number;

    const waves: Array<{
      yOffset: number;
      amplitude: number;
      frequency: number;
      speed: number;
    }> = [];

    function init() {
      w = canvas!.width = window.innerWidth;
      h = canvas!.height = window.innerHeight;

      waves.length = 0;
      for (let i = 0; i < 5; i++) {
        waves.push({
          yOffset: h * (0.15 + i * 0.17),
          amplitude: Math.random() * 40 + 20,
          frequency: Math.random() * 0.002 + 0.001,
          speed: Math.random() * 0.02 + 0.01,
        });
      }
    }

    function animate() {
      animationId = requestAnimationFrame(animate);
      ctx!.clearRect(0, 0, w, h);
      time += 1;

      ctx!.lineWidth = 1;

      waves.forEach((wave, index) => {
        ctx!.beginPath();
        ctx!.moveTo(0, h);

        for (let x = 0; x <= w; x += 20) {
          let mouseInfluence = 0;
          if (Math.abs(x - mx) < 300) {
            const force = (300 - Math.abs(x - mx)) / 300;
            mouseInfluence = ((my - wave.yOffset) * force * 0.2);
          }

          const y = wave.yOffset
            + Math.sin(x * wave.frequency + (time * wave.speed)) * wave.amplitude
            + mouseInfluence;
          ctx!.lineTo(x, y);
        }

        ctx!.lineTo(w, h);
        ctx!.lineTo(0, h);

        // Indigo-tinted gradient for the mercury look
        const gradient = ctx!.createLinearGradient(0, wave.yOffset - 100, 0, h);
        gradient.addColorStop(0, `rgba(99, 102, 241, ${0.04 - (index * 0.006)})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx!.fillStyle = gradient;
        ctx!.fill();

        // Edge highlight — subtle indigo line
        ctx!.strokeStyle = `rgba(99, 102, 241, ${0.04 - (index * 0.007)})`;
        ctx!.stroke();
      });
    }

    init();
    animate();

    const handleMouse = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const handleResize = () => {
      init();
    };

    window.addEventListener('mousemove', handleMouse, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('resize', handleResize);
    };
  }, [isHQ]);

  return (
    <canvas
      ref={canvasRef}
      id="liquid-canvas"
      aria-hidden="true"
      role="presentation"
      className="fixed top-0 left-0 w-screen h-screen pointer-events-none"
      style={{ opacity: 0.6, mixBlendMode: 'screen', display: isHQ ? 'none' : 'block' }}
    />
  );
}
