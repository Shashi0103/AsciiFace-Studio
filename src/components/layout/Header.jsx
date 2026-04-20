/**
 * Header.jsx — Top navigation bar with logo, theme switcher, keyboard hints
 */
import { motion } from 'framer-motion';
import { Monitor, Cpu, Zap, Keyboard } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useState } from 'react';

export default function Header({ onShowShortcuts }) {
  const { exitStudio, useLiveCamera } = useAppStore();

  return (
    <header style={{
      gridRow: '1',
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      padding: '0 20px',
      borderBottom: '1px solid var(--border-dim)',
      background: 'var(--bg-surface)',
      backdropFilter: 'blur(16px)',
      position: 'relative',
      zIndex: 100,
      height: '66px',
    }}>
      {/* Logo / Home Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.02, backgroundColor: 'rgba(57, 255, 20, 0.06)', borderColor: 'var(--neon-green)' }}
        whileTap={{ scale: 0.98 }}
        onClick={exitStudio}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 12,
          cursor: 'pointer',
          padding: '6px 16px',
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 255, 65, 0.25)',
          borderRadius: '12px',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          justifySelf: 'start'
        }}
        title="Return to Landing Page"
      >
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: '0.08em',
            color: 'var(--text-primary)',
            textShadow: '0 0 10px rgba(0,255,65,0.2)',
            lineHeight: 1.1,
            whiteSpace: 'nowrap'
          }}>
            <span style={{ color: 'var(--neon-green)' }}>ASCII</span>Face Studio<span className="cursor-blink" style={{ color: 'var(--neon-green)', marginLeft: 2 }}>_</span>
          </div>
        </div>
      </motion.div>

      {/* Center status badge (Grid Centered) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ 
          display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
          color: useLiveCamera ? 'var(--neon-green)' : 'var(--neon-cyan)',
          padding: '6px 14px', borderRadius: '100px',
          background: useLiveCamera ? 'rgba(0,255,65,0.05)' : 'rgba(0,210,255,0.05)',
          border: useLiveCamera ? '1px solid rgba(0,255,65,0.15)' : '1px solid rgba(0,210,255,0.15)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap'
        }}
      >
        <div className="pulse-dot" style={{ 
          background: useLiveCamera ? 'var(--neon-green)' : 'var(--neon-cyan)',
          boxShadow: useLiveCamera ? '0 0 8px var(--neon-green)' : '0 0 8px var(--neon-cyan)'
        }} />
        {useLiveCamera ? 'LIVE STREAM ACTIVE' : 'MEDIA SOURCE: IMAGE'}
      </motion.div>

      {/* Right controls */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ display: 'flex', alignItems: 'center', gap: 12, justifySelf: 'end' }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>
          <Zap size={10} style={{ display: 'inline', marginRight: 3 }} />
          WebGL READY
        </span>
      </motion.div>
    </header>
  );
}
