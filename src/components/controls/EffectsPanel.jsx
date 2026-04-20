/**
 * EffectsPanel.jsx — Aesthetic effect selection grid
 */
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { EFFECTS } from '../../engine/effects';

const EFFECT_INFO = {
  none:        { icon: '○', color: 'var(--text-dim)' },
  cyberpunk:   { icon: '⚡', color: 'var(--neon-cyan)' },
  matrix:      { icon: '⬛', color: 'var(--neon-green)' },
  bw:          { icon: '◑', color: '#888' },
  sepia:       { icon: '🌅', color: '#c8a26e' },
  thermal:     { icon: '🌡', color: '#ff4400' },
  glitch:      { icon: '▓', color: 'var(--neon-pink)' },
  holographic: { icon: '◈', color: 'var(--neon-purple)' },
};

export default function EffectsPanel() {
  const { activeEffect, setActiveEffect } = useAppStore();

  return (
    <div className="panel">
      <div className="panel-header">
        <Sparkles size={13} />
        Aesthetic Effects
        {activeEffect !== 'none' && (
          <span className="tag tag-cyan" style={{ marginLeft: 'auto' }}>
            {EFFECTS[activeEffect]}
          </span>
        )}
      </div>

      <div style={{ padding: '12px 14px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 6,
        }}>
          {Object.entries(EFFECTS).map(([id, label], i) => {
            const info = EFFECT_INFO[id] || { icon: '●', color: 'var(--neon-green)' };
            const isActive = activeEffect === id;

            return (
              <motion.button
                key={id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`effect-card ${isActive ? 'active' : ''}`}
                onClick={() => setActiveEffect(id)}
                style={{
                  borderColor: isActive ? info.color : undefined,
                  color: isActive ? info.color : undefined,
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 3, lineHeight: 1 }}>{info.icon}</div>
                <div style={{ fontSize: 9, letterSpacing: '0.05em', fontWeight: 600 }}>
                  {label.split(' ')[0]}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
