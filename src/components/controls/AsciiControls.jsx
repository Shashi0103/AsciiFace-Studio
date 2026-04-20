/**
 * AsciiControls.jsx — ASCII and Pixel art configuration panel
 */
import { motion } from 'framer-motion';
import { Type, Grid3X3, Palette } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { CHAR_SETS } from '../../engine/asciiEngine';

const CHAR_SET_OPTIONS = Object.entries(CHAR_SETS).map(([id, chars]) => ({
  id,
  label: id.charAt(0).toUpperCase() + id.slice(1),
  preview: (chars || '').slice(0, 16),
}));

const FONT_FAMILIES = [
  'JetBrains Mono',
  'Courier New',
  'Lucida Console',
  'Consolas',
  'Source Code Pro',
];

const COLOR_MODES = [
  { id: 'color',  label: 'Color',  color: 'var(--neon-cyan)' },
  { id: 'green',  label: 'Matrix', color: 'var(--neon-green)' },
  { id: 'white',  label: 'White',  color: '#fff' },
  { id: 'custom', label: 'Custom', color: 'var(--neon-pink)' },
];

export default function AsciiControls() {
  const { mode, setMode, asciiConfig, setAsciiConfig, pixelConfig, setPixelConfig } = useAppStore();

  return (
    <div className="panel">
      <div className="panel-header">
        <Type size={13} />
        {mode === 'ascii' ? 'ASCII Config' : 'Pixel Config'}

        {/* Mode toggle */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          {['ascii', 'pixel'].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="btn-neon"
              style={{
                fontSize: 10, padding: '3px 10px',
                background: mode === m ? 'rgba(0,255,65,0.2)' : 'transparent',
                borderColor: mode === m ? 'var(--neon-green)' : 'var(--border-dim)',
                color: mode === m ? 'var(--neon-green)' : 'var(--text-dim)',
              }}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ padding: '14px 16px' }}
      >
        {mode === 'ascii' ? (
          <>
            {/* Density */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>Density (Cols)</label>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--neon-green)' }}>{asciiConfig.density}</span>
              </div>
              <input type="range" min={10} max={200} step={5} value={asciiConfig.density}
                onChange={(e) => setAsciiConfig('density', parseInt(e.target.value))} style={{ width: '100%' }} />
            </div>

            {/* Character Set */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                Character Set
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                {CHAR_SET_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setAsciiConfig('charSet', opt.id)}
                    style={{
                      padding: '6px 8px',
                      background: asciiConfig.charSet === opt.id ? 'rgba(0,255,65,0.12)' : 'var(--bg-glass-light)',
                      border: `1px solid ${asciiConfig.charSet === opt.id ? 'var(--neon-green)' : 'var(--border-dim)'}`,
                      borderRadius: 6,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: asciiConfig.charSet === opt.id ? 'var(--neon-green)' : 'var(--text-secondary)', fontWeight: 600 }}>
                      {opt.label}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {opt.preview}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom chars */}
            {asciiConfig.charSet === 'custom' && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>
                  Custom Characters
                </label>
                <input
                  type="text"
                  value={asciiConfig.customChars}
                  onChange={(e) => setAsciiConfig('customChars', e.target.value)}
                  placeholder="e.g. @#:. "
                  style={{
                    width: '100%', padding: '7px 10px',
                    background: 'var(--bg-glass-light)',
                    border: '1px solid var(--border-dim)',
                    borderRadius: 6, color: 'var(--neon-green)',
                    fontFamily: 'var(--font-mono)', fontSize: 13,
                    outline: 'none',
                  }}
                />
              </div>
            )}

            {/* Font Family */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Font Family</label>
              <select
                value={asciiConfig.fontFamily}
                onChange={(e) => setAsciiConfig('fontFamily', e.target.value)}
                style={{
                  width: '100%', padding: '7px 10px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-dim)',
                  borderRadius: 6, color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)', fontSize: 12,
                  outline: 'none', cursor: 'pointer',
                }}
              >
                {FONT_FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            {/* Color Mode */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                <Palette size={11} style={{ display: 'inline', marginRight: 5 }} />Color Mode
              </label>
              <div style={{ display: 'flex', gap: 4 }}>
                {COLOR_MODES.map(cm => (
                  <button
                    key={cm.id}
                    onClick={() => setAsciiConfig('colorMode', cm.id)}
                    style={{
                      flex: 1, padding: '5px',
                      background: asciiConfig.colorMode === cm.id ? 'rgba(0,255,65,0.1)' : 'var(--bg-glass-light)',
                      border: `1px solid ${asciiConfig.colorMode === cm.id ? cm.color : 'var(--border-dim)'}`,
                      borderRadius: 5, cursor: 'pointer',
                      fontFamily: 'var(--font-mono)', fontSize: 9.5,
                      fontWeight: 600, color: asciiConfig.colorMode === cm.id ? cm.color : 'var(--text-dim)',
                      transition: 'all 0.15s',
                    }}
                  >
                    {cm.label}
                  </button>
                ))}
              </div>
              {asciiConfig.colorMode === 'custom' && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="color"
                    value={asciiConfig.customColor}
                    onChange={(e) => setAsciiConfig('customColor', e.target.value)}
                    style={{ width: 36, height: 36, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'none' }}
                  />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>
                    {asciiConfig.customColor}
                  </span>
                </div>
              )}
            </div>

            {/* Invert chars toggle */}
            <div
              className="toggle-container"
              onClick={() => setAsciiConfig('invertChars', !asciiConfig.invertChars)}
            >
              <div className={`toggle ${asciiConfig.invertChars ? 'on' : ''}`} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                Invert Characters
              </span>
            </div>

            <div
              className="toggle-container"
              style={{ marginTop: 8 }}
              onClick={() => setAsciiConfig('autoCenter', !asciiConfig.autoCenter)}
            >
              <div className={`toggle ${asciiConfig.autoCenter ? 'on' : ''}`} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                Face Auto-Center
              </span>
            </div>
          </>
        ) : (
          <>
            {/* Pixel block size */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>Block Size</label>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--neon-green)' }}>{pixelConfig.blockSize}px</span>
              </div>
              <input type="range" min={2} max={40} step={1} value={pixelConfig.blockSize}
                onChange={(e) => setPixelConfig('blockSize', parseInt(e.target.value))} style={{ width: '100%' }} />
            </div>

            <div
              className="toggle-container"
              onClick={() => setPixelConfig('showGrid', !pixelConfig.showGrid)}
            >
              <div className={`toggle ${pixelConfig.showGrid ? 'on' : ''}`} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <Grid3X3 size={11} style={{ display: 'inline', marginRight: 5 }} />Show Grid
              </span>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
