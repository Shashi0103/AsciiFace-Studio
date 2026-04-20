/**
 * ImageControls.jsx — All image adjustment sliders
 */
import { memo } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const SLIDERS = [
  { key: 'brightness',    label: 'Brightness',    min: 0,   max: 200, step: 1,   default: 100, unit: '%' },
  { key: 'contrast',      label: 'Contrast',      min: 0,   max: 300, step: 1,   default: 100, unit: '%' },
  { key: 'saturation',    label: 'Saturation',    min: 0,   max: 300, step: 1,   default: 100, unit: '%' },
  { key: 'sharpness',     label: 'Sharpness',     min: 0,   max: 100, step: 1,   default: 0,   unit: '' },
  { key: 'blur',          label: 'Blur',          min: 0,   max: 10,  step: 0.1, default: 0,   unit: '' },
  { key: 'exposure',      label: 'Exposure',      min: -10, max: 10,  step: 0.1, default: 0,   unit: '' },
  { key: 'gamma',         label: 'Gamma',         min: 0.1, max: 3,   step: 0.05,default: 1,   unit: '' },
  { key: 'hue',           label: 'Hue / Tone',    min: -180,max: 180, step: 1,   default: 0,   unit: '°' },
  { key: 'noiseReduction',label: 'Noise Reduce',  min: 0,   max: 5,   step: 1,   default: 0,   unit: '' },
];

const TOGGLES = [
  { key: 'invert',     label: 'Invert Colors' },
  { key: 'edgeDetect', label: 'Edge Detection' },
  { key: 'mirror',     label: 'Mirror (Selfie Mode)' },
];

const ControlSlider = memo(({ slider, value, onChange }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: 5,
    }}>
      <label style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11, color: 'var(--text-secondary)',
        letterSpacing: '0.05em',
      }}>
        {slider.label}
      </label>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 11,
        color: 'var(--neon-green)', minWidth: 40, textAlign: 'right',
      }}>
        {typeof value === 'number' ? value.toFixed(slider.step < 1 ? 1 : 0) : value}{slider.unit}
      </span>
    </div>
    <input
      type="range"
      min={slider.min}
      max={slider.max}
      step={slider.step}
      value={value}
      onChange={(e) => onChange(slider.key, parseFloat(e.target.value))}
      style={{ width: '100%' }}
    />
  </div>
));

const ControlToggle = memo(({ toggle, value, onChange }) => (
  <div
    className="toggle-container"
    style={{ marginBottom: 10 }}
    onClick={() => onChange(toggle.key, !value)}
  >
    <div className={`toggle ${value ? 'on' : ''}`} />
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', cursor: 'pointer' }}>
      {toggle.label}
    </span>
  </div>
));

export default function ImageControls() {
  const { controls, setControl, resetControls } = useAppStore();

  return (
    <div className="panel">
      <div className="panel-header" style={{ justifyContent: 'space-between' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <SlidersHorizontal size={13} />
          Image Controls
        </span>
        <button
          className="btn-icon"
          style={{ width: 28, height: 28 }}
          onClick={resetControls}
          title="Reset all controls"
        >
          <RotateCcw size={12} />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ padding: '14px 16px' }}
      >
        {SLIDERS.map(slider => (
          <ControlSlider
            key={slider.key}
            slider={slider}
            value={controls[slider.key] ?? slider.default}
            onChange={setControl}
          />
        ))}

        <div style={{ borderTop: '1px solid var(--border-dim)', paddingTop: 12, marginTop: 4 }}>
          {TOGGLES.map(toggle => (
            <ControlToggle
              key={toggle.key}
              toggle={toggle}
              value={controls[toggle.key] ?? false}
              onChange={setControl}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
