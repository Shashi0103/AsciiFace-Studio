/**
 * KeyboardShortcuts.jsx — Modal overlay showing all keyboard shortcuts
 */
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';

const SHORTCUTS = [
  { keys: ['Space'], action: 'Process / Render' },
  { keys: ['L'], action: 'Toggle Live Mode' },
  { keys: ['C'], action: 'Capture from Camera' },
  { keys: ['A'], action: 'Switch to ASCII mode' },
  { keys: ['P'], action: 'Switch to Pixel mode' },
  { keys: ['+', '='], action: 'Zoom In' },
  { keys: ['-'], action: 'Zoom Out' },
  { keys: ['0'], action: 'Reset Zoom' },
  { keys: ['R'], action: 'Reset all controls' },
  { keys: ['Ctrl', 'S'], action: 'Save Preset' },
  { keys: ['Ctrl', 'D'], action: 'Download PNG' },
  { keys: ['Ctrl', 'C'], action: 'Copy ASCII Text' },
  { keys: ['?'], action: 'Show this help' },
  { keys: ['Esc'], action: 'Close this modal' },
];

export default function KeyboardShortcuts({ onClose }) {
  return (
    <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Keyboard size={14} />
          <span>KEYBOARD GUIDE</span>
        </div>
        <button className="btn-icon" style={{ width: 28, height: 28 }} onClick={onClose}>
          <X size={14} />
        </button>
      </div>

      <div style={{ 
        padding: '16px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 8,
        overflowY: 'auto'
      }}>
        {SHORTCUTS.map((s, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 0',
            borderBottom: '1px solid var(--border-dim)',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>
              {s.action}
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              {s.keys.map(k => (
                <kbd key={k} style={{
                  padding: '2px 8px',
                  background: 'rgba(57, 255, 20, 0.05)',
                  border: '1px solid var(--border-dim)',
                  borderRadius: 4,
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  color: 'var(--neon-green)',
                }}>
                  {k}
                </kbd>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
