/**
 * AsciiOutput.jsx — Main output canvas with live mode, zoom, and mode toggle
 */
import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RefreshCw, Video, VideoOff } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useCanvas } from '../../hooks/useCanvas';
import { detectFaces } from '../../engine/faceDetection';

const AsciiOutput = forwardRef(function AsciiOutput({ videoRef: extVideoRef }, ref) {
  const outputCanvasRef = useRef(null);

  // Expose canvas element to parent via ref
  useImperativeHandle(ref, () => ({
    get current() { return outputCanvasRef.current; }
  }), []);
  const liveRafRef = useRef(null);
  const [isRendering, setIsRendering] = useState(false);

  const {
    mode, controls, asciiConfig, pixelConfig, activeEffect,
    zoom, setZoom, setFaceBounds,
    mediaSource, useLiveCamera,
  } = useAppStore();

  const { processImage } = useCanvas();

  // Live camera mode — always on if video is ready
  useEffect(() => {
    if (!extVideoRef?.current) {
      cancelAnimationFrame(liveRafRef.current);
      return;
    }

    let lastTime = 0;
    const TARGET_FPS = 12;
    const INTERVAL = 1000 / TARGET_FPS;

    const frame = (ts) => {
      liveRafRef.current = requestAnimationFrame(frame);
      if (ts - lastTime < INTERVAL) return;
      lastTime = ts;

      const video = extVideoRef.current;
      const canvas = outputCanvasRef.current;
      
      // Determine source
      const source = useLiveCamera ? video : mediaSource;
      
      if (!source || !canvas) return;
      
      // If video source, check readyState
      if (useLiveCamera && source.readyState < 2) return;

      processImage({
        source,
        outputCanvas: canvas,
        controls, mode, asciiConfig, pixelConfig, activeEffect,
        faceBounds: null,
      });
    };

    liveRafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(liveRafRef.current);
  }, [extVideoRef, controls, mode, asciiConfig, pixelConfig, activeEffect, processImage, useLiveCamera, mediaSource]);

  return (
    <motion.div 
      className="canvas-background-layer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Floating Status Badge */}
      <div style={{ 
        position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
        fontFamily: 'var(--font-mono)', fontSize: 10, color: useLiveCamera ? 'var(--neon-green)' : 'var(--neon-cyan)', 
        display: 'flex', alignItems: 'center', gap: 6,
        background: useLiveCamera ? 'rgba(0,255,65,0.08)' : 'rgba(0,210,255,0.08)', padding: '5px 12px', borderRadius: 100,
        border: useLiveCamera ? '1px solid rgba(0,255,65,0.2)' : '1px solid rgba(0,210,255,0.2)', backdropFilter: 'blur(8px)',
        zIndex: 50, letterSpacing: '0.1em', pointerEvents: 'none'
      }}>
        <div className="pulse-dot" style={{ background: useLiveCamera ? 'var(--neon-green)' : 'var(--neon-cyan)', boxShadow: useLiveCamera ? '0 0 10px var(--neon-green)' : '0 0 10px var(--neon-cyan)' }} />
        {useLiveCamera ? 'LIVE STREAM ACTIVE' : 'MEDIA SOURCE: IMAGE'}
      </div>

      {/* Rendering indicator */}
      {isRendering && (
        <div style={{
          position: 'fixed', top: 20, right: 20,
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(0,0,0,0.7)', padding: '4px 10px',
          borderRadius: 6, backdropFilter: 'blur(4px)', zIndex: 60
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--neon-yellow)',
            animation: 'pulse-glow 0.5s infinite',
          }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--neon-yellow)' }}>RENDERING</span>
        </div>
      )}

      {/* Output canvas - Fixed and filling viewport */}
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        zIndex: -1, /* Behind sidebars */
      }}>
        <canvas
          ref={outputCanvasRef}
          id="ascii-output-canvas"
          style={{
            width: '100vw',
            height: '100vh',
            objectFit: useLiveCamera ? 'cover' : 'contain',
            imageRendering: mode === 'pixel' ? 'pixelated' : 'auto',
            transform: `scale(${zoom})`,
            transition: 'transform 0.2s ease-out',
          }}
        />
      </div>
    </motion.div>
  );
});

export default AsciiOutput;
