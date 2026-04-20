/**
 * ExportPanel.jsx — Captured frame save system (PNG/JPG/TXT/SVG)
 */
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, Check, FileText, Image, FileCode, Camera } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { getAsciiText } from '../../engine/asciiEngine';

const FORMATS = [
  { id: 'png',  label: 'PNG',  icon: <Image size={13} />,    mime: 'image/png' },
  { id: 'jpg',  label: 'JPG',  icon: <Image size={13} />,    mime: 'image/jpeg' },
  { id: 'txt',  label: 'TXT',  icon: <FileText size={13} />, mime: 'text/plain' },
  { id: 'svg',  label: 'SVG',  icon: <FileCode size={13} />, mime: 'image/svg+xml' },
];

export default function ExportPanel() {
  const { 
    exportFilename, setExportFilename, 
    mode, 
    lastSnapshot, lastSnapshotText 
  } = useAppStore();

  const [selectedFormat, setSelectedFormat] = useState('png');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!lastSnapshot) return;

    setDownloading(true);
    const name = exportFilename.trim() || 'ascii-studio-capture';

    try {
      if (selectedFormat === 'txt') {
        const text = lastSnapshotText || '';
        const blob = new Blob([text], { type: 'text/plain' });
        triggerDownload(URL.createObjectURL(blob), `${name}.txt`);
      } else if (selectedFormat === 'svg') {
        const svgStr = generateVectorSVG(lastSnapshot);
        const blob = new Blob([svgStr], { type: 'image/svg+xml' });
        triggerDownload(URL.createObjectURL(blob), `${name}.svg`);
      } else {
        // High-reliability Blob conversion for PNG/JPG
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = img.width;
          tempCanvas.height = img.height;
          const ctx = tempCanvas.getContext('2d');
          
          if (selectedFormat === 'jpg') {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
          }
          
          ctx.drawImage(img, 0, 0);
          const mime = selectedFormat === 'jpg' ? 'image/jpeg' : 'image/png';
          tempCanvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              triggerDownload(url, `${name}.${selectedFormat}`);
            }
          }, mime, 0.95);
        };
        img.src = lastSnapshot;
      }
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  const handleCopyAscii = async () => {
    if (!lastSnapshotText) return;
    try {
      await navigator.clipboard.writeText(lastSnapshotText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="panel" style={{ background: 'transparent', border: 'none' }}>
      <div className="panel-header" style={{ background: 'rgba(57, 255, 20, 0.05)', borderRadius: '12px 12px 0 0' }}>
        <Camera size={13} />
        CAPTURE & SAVE
      </div>

      <div style={{ padding: '20px 0' }}>
        {/* Snapshot Preview */}
        {lastSnapshot && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', display: 'block', marginBottom: 8, letterSpacing: '0.1em' }}>
              CAPTURED POSE
            </label>
            <div style={{ 
              width: '100%', 
              aspectRatio: '16/9', 
              borderRadius: 12, 
              overflow: 'hidden', 
              border: '1px solid var(--neon-green)',
              boxShadow: 'var(--glow-green)',
              background: '#000',
              position: 'relative'
            }}>
              <img src={lastSnapshot} alt="Capture Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ 
                position: 'absolute', top: 8, right: 8, 
                padding: '2px 8px', background: 'rgba(57, 255, 20, 0.9)', color: '#000',
                fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 800, borderRadius: 4
              }}>
                READY
              </div>
            </div>
          </div>
        )}

        {/* Filename Input */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', display: 'block', marginBottom: 8, letterSpacing: '0.1em' }}>
            PROJECT NAME
          </label>
          <input
            type="text"
            value={exportFilename}
            onChange={(e) => setExportFilename(e.target.value)}
            placeholder="my-ascii-vision"
            style={{
              width: '100%', padding: '12px 14px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-dim)',
              borderRadius: 10, color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)', fontSize: 13,
              outline: 'none',
              transition: 'all 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--neon-green)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-dim)'}
          />
        </div>

        {/* Format Grid */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', display: 'block', marginBottom: 8, letterSpacing: '0.1em' }}>
            EXPORT FORMAT
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {FORMATS.map(fmt => (
              <button
                key={fmt.id}
                onClick={() => setSelectedFormat(fmt.id)}
                style={{
                  padding: '12px 10px',
                  background: selectedFormat === fmt.id ? 'rgba(57, 255, 20, 0.1)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${selectedFormat === fmt.id ? 'var(--neon-green)' : 'var(--border-dim)'}`,
                  borderRadius: 10, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10,
                  color: selectedFormat === fmt.id ? 'var(--neon-green)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                  transition: 'all 0.2s',
                }}
              >
                {fmt.icon}
                {fmt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Save Button */}
        <motion.button
          whileHover={{ scale: 1.01, boxShadow: '0 0 20px rgba(57, 255, 20, 0.2)' }}
          whileTap={{ scale: 0.98 }}
          className="btn-neon primary"
          style={{ 
            width: '100%', 
            height: '44px',
            fontSize: 13, 
            marginBottom: 10, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 8,
            borderRadius: 12
          }}
          onClick={handleDownload}
          disabled={downloading || !lastSnapshot}
        >
          {downloading ? (
             <div className="animate-pulse-glow">ENCAPSULATING...</div>
          ) : (
            <>
              <Download size={14} />
              DOWNLOAD {selectedFormat.toUpperCase()}
            </>
          )}
        </motion.button>

        {/* Copy Quick Action */}
        {mode === 'ascii' && (
          <motion.button
            whileHover={{ scale: 1.01, background: 'rgba(0, 212, 255, 0.1)' }}
            whileTap={{ scale: 0.98 }}
            className="btn-neon cyan"
            style={{ 
              width: '100%', 
              height: '40px',
              fontSize: 11, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 8,
              borderRadius: 12,
              border: '1px solid var(--border-cyan)'
            }}
            onClick={handleCopyAscii}
          >
            {copied ? <Check size={14} /> : <Copy size={13} />}
            {copied ? 'COPIED TO CLIPBOARD' : 'COPY ASCII CODE'}
          </motion.button>
        )}
      </div>
    </div>
  );
}

function triggerDownload(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Only revoke if it's a blob url, not a base64 from snapshot
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

function generateVectorSVG(dataUrl) {
  // We use the aspect ratio of the captured image
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#07070A"/>
  <image width="100%" height="100%" href="${dataUrl}"/>
  <!-- AsciiFace Studio Vector Capture -->
</svg>`;
}
