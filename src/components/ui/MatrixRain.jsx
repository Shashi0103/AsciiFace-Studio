/**
 * MatrixRain.jsx — Background matrix digital rain effect
 */
import { useEffect, useRef } from 'react';

export default function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    
    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*()*&^%'.split('');
    const fontSize = 14;
    const columns = Math.ceil(width / fontSize);
    const drops = new Array(columns).fill(1).map(() => Math.random() * -100);

    const draw = () => {
      // Fade background
      ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#0F0'; // Neon default, theme logic could go here
      ctx.font = `${fontSize}px JetBrains Mono`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        // Randomly color some chars brighter
        if (Math.random() > 0.95) ctx.fillStyle = '#AFA';
        else ctx.fillStyle = 'rgba(0, 255, 65, 0.5)';

        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    let lastTime = 0;
    const TARGET_FPS = 20;
    const INTERVAL = 1000 / TARGET_FPS;

    let rafId;
    const render = (ts) => {
      rafId = requestAnimationFrame(render);
      if (ts - lastTime < INTERVAL) return;
      lastTime = ts;
      draw();
    };

    rafId = requestAnimationFrame(render);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        opacity: 0.65,
        pointerEvents: 'none',
      }}
    />
  );
}
