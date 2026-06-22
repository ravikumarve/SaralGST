'use client';

import { useEffect, useRef, useState } from 'react';

export default function FlowFieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHQ, setIsHQ] = useState(false);

  useEffect(() => {
    setIsHQ(window.location.pathname.startsWith('/hq'));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isHQ) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let time = 0;
    let mouseX = -1000;
    let mouseY = -1000;
    let frameCount = 0;
    let animationId: number;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseSpeed: number;
      size: number;
    }> = [];

    // CPU-aware scaling
    const cpuCores = navigator.hardwareConcurrency || 4;
    let targetParticles = 800;
    if (cpuCores <= 2) targetParticles = 200;
    else if (cpuCores <= 4) targetParticles = 400;
    else if (cpuCores <= 6) targetParticles = 600;

    const noiseScale = 0.005;

    function init() {
      width = canvas!.width = window.innerWidth;
      height = canvas!.height = window.innerHeight;

      const count = width < 768 ? Math.floor(targetParticles / 2) : targetParticles;

      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: 0,
          vy: 0,
          baseSpeed: 0.5 + Math.random() * 1.5,
          size: Math.random() * 1.5 + 0.3,
        });
      }
    }

    function getNoiseAngle(x: number, y: number, t: number) {
      return Math.sin(x * noiseScale + t) * Math.cos(y * noiseScale + t) * Math.PI * 2;
    }

    function animate() {
      animationId = requestAnimationFrame(animate);
      frameCount++;

      if (frameCount % 120 === 0) {
        ctx!.clearRect(0, 0, width, height);
      }

      ctx!.fillStyle = 'rgba(2, 2, 2, 0.15)';
      ctx!.fillRect(0, 0, width, height);

      time += 0.003;
      ctx!.fillStyle = 'rgba(245, 158, 11, 0.6)';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const angle = getNoiseAngle(p.x, p.y, time);

        p.vx += Math.cos(angle) * 0.1;
        p.vy += Math.sin(angle) * 0.1;

        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150;
          p.vx += (dx / dist) * force * 2;
          p.vy += (dy / dist) * force * 2;
        }

        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x += p.vx * p.baseSpeed;
        p.y += p.vy * p.baseSpeed;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    init();
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        mouseX = touch.clientX;
        mouseY = touch.clientY;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        mouseX = touch.clientX;
        mouseY = touch.clientY;
      }
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(init, 300);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="flow-canvas"
      aria-hidden="true"
      role="presentation"
      className="fixed top-0 left-0 w-screen h-screen pointer-events-none opacity-80"
      style={{ zIndex: 0, mixBlendMode: 'screen', display: isHQ ? 'none' : 'block' }}
    />
  );
}
