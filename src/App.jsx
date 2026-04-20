/**
 * App.jsx — Main application shell for AsciiFace Studio
 * Assembles all panels, handles keyboard shortcuts, theme application
 */
import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Settings, Download, Keyboard, Camera, Upload, RefreshCw, X } from 'lucide-react';
import Header from './components/layout/Header.jsx';
import CameraPanel from './components/camera/CameraPanel.jsx';
import ImageControls from './components/controls/ImageControls.jsx';
import AsciiControls from './components/controls/AsciiControls.jsx';
import EffectsPanel from './components/controls/EffectsPanel.jsx';
import AsciiOutput from './components/output/AsciiOutput.jsx';
import ExportPanel from './components/export/ExportPanel.jsx';
import MatrixRain from './components/ui/MatrixRain.jsx';
import KeyboardShortcuts from './components/ui/KeyboardShortcuts.jsx';
import Hero from './components/layout/Hero.jsx';

import { useAppStore } from './store/useAppStore.js';
import { useCamera } from './hooks/useCamera.js';
import { getAsciiText } from './engine/asciiEngine.js';

export default function App() {
  const outputCanvasRef = useRef(null);
  const [notification, setNotification] = useState(null);

  const {
    hasEnteredStudio,
    mode, setMode,
    zoom, setZoom,
    resetControls,
    sidebarLeftOpen, sidebarRightOpen, sidebarShortcutsOpen,
    toggleSidebarLeft, toggleSidebarRight, toggleSidebarShortcuts,
    setLastSnapshot,
    asciiConfig,
    mediaSource, useLiveCamera, setMediaSource, resetToCamera,
  } = useAppStore();

  const camera = useCamera();

  // Notification helper
  const notify = useCallback((msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 2000);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      const key = e.key.toLowerCase();

      if (key === '?' || (key === '/' && e.shiftKey)) {
        e.preventDefault();
        setShowShortcuts(v => !v);
      }
      if (key === 'escape') {
        setShowShortcuts(false);
      }
      if (key === 'a') {
        setMode('ascii');
        notify('ASCII Mode');
      }
      if (key === 'p') {
        setMode('pixel');
        notify('Pixel Art Mode');
      }
      if (key === '[' ) {
        toggleSidebarLeft();
      }
      if (key === ']' ) {
        toggleSidebarRight();
      }
      if (key === '+' || key === '=') {
        setZoom(zoom + 0.25);
      }
      if (key === '-') {
        setZoom(zoom - 0.25);
      }
      if (key === '0') {
        setZoom(1);
      }
      if (key === 'r') {
        resetControls();
        notify('Controls Reset');
      }
      if ((e.ctrlKey || e.metaKey) && key === 'd') {
        e.preventDefault();
        const canvas = outputCanvasRef.current?.current || outputCanvasRef.current;
        if (canvas) {
          canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'ascii-art.png'; a.click();
            URL.revokeObjectURL(url);
            notify('Downloaded PNG!');
          });
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [zoom, mode, setMode, setZoom, resetControls, notify, toggleSidebarLeft, toggleSidebarRight, toggleSidebarShortcuts, sidebarShortcutsOpen]);

  // Hidden camera handler logic (starts camera even without PIP)
  useEffect(() => {
    if (hasEnteredStudio && !camera.isStreaming && !camera.error) {
       camera.startCamera('user');
    }
  }, [hasEnteredStudio, camera]);

  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notify('Please select an image file', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setMediaSource(img);
        notify('Photo Loaded!');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Combined Shutter + Save Open
  const handleSaveClick = useCallback(() => {
    // 1. Capture current frame from the output canvas ref
    const canvas = outputCanvasRef.current?.current || outputCanvasRef.current;
    
    // Choose source for raw text snapshot
    const source = useLiveCamera ? camera.videoRef.current : mediaSource;
    
    if (canvas && source) {
      // Snapshot image
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      
      // Snapshot ASCII text
      const tempCanvas = document.createElement('canvas');
      const srcW = source.videoWidth || source.naturalWidth || source.width;
      const srcH = source.videoHeight || source.naturalHeight || source.height;
      tempCanvas.width = srcW;
      tempCanvas.height = srcH;
      tempCanvas.getContext('2d').drawImage(source, 0, 0);
      const text = getAsciiText(tempCanvas, asciiConfig);
      
      setLastSnapshot(dataUrl, text);
    }
    
    // 2. Open the save drawer
    toggleSidebarRight();
  }, [setLastSnapshot, toggleSidebarRight, camera, asciiConfig, outputCanvasRef, useLiveCamera, mediaSource]);

  return (
    <div className="app-layout">
      {/* Background matrix rain (low opacity) */}
      <MatrixRain />

      <AnimatePresence mode="wait">
        {!hasEnteredStudio ? (
          <Hero key="hero" />
        ) : (
          <motion.div
            key="studio"
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
          >
            {/* Layer 0: Fullscreen Output Background */}
            <AsciiOutput
              videoRef={camera.videoRef}
              ref={outputCanvasRef}
            />

            {/* Layer 1: Header */}
            <Header onShowShortcuts={toggleSidebarShortcuts} />

            {/* Layer 2: Sidebars & Drawers */}
            <div className="sidebar-overlay">
              {/* Left Sidebar: Controls */}
              <motion.aside
                className={`sidebar sidebar-left ${sidebarLeftOpen ? 'open' : ''}`}
                initial={false}
                animate={{ x: sidebarLeftOpen ? 0 : -400, opacity: sidebarLeftOpen ? 1 : 0 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              >
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: -10 }}>
                  <button 
                    onClick={toggleSidebarLeft}
                    style={{
                      background: 'rgba(255,255,255,0.05)', border: 'none', 
                      color: 'var(--text-dim)', padding: 6, borderRadius: '50%',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--neon-green)'; e.currentTarget.style.background = 'rgba(0,255,65,0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    title="Close Sidebar"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <AsciiControls />
                  <ImageControls />
                  <EffectsPanel />
                </div>
              </motion.aside>

              {/* Right Sidebar: Export */}
              <motion.aside
                className={`sidebar sidebar-right ${sidebarRightOpen ? 'open' : ''}`}
                initial={false}
                animate={{ x: sidebarRightOpen ? 0 : 450, opacity: sidebarRightOpen ? 1 : 0 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              >
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: -10 }}>
                  <button 
                    onClick={toggleSidebarRight}
                    style={{
                      background: 'rgba(255,255,255,0.05)', border: 'none', 
                      color: 'var(--text-dim)', padding: 6, borderRadius: '50%',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--neon-green)'; e.currentTarget.style.background = 'rgba(0,255,65,0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    title="Close Export"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <ExportPanel />
                </div>
              </motion.aside>

              {/* Bottom Drawer: Shortcuts */}
              <motion.div
                className={`sidebar sidebar-bottom ${sidebarShortcutsOpen ? 'open' : ''}`}
                initial={false}
                animate={{ y: sidebarShortcutsOpen ? 0 : 600, opacity: sidebarShortcutsOpen ? 1 : 0 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              >
                <KeyboardShortcuts onClose={() => toggleSidebarShortcuts()} />
              </motion.div>
            </div>

            {/* Hidden Video Source (Required for ASCII engine even without PIP) */}
            <video 
              ref={camera.videoRef} 
              style={{ display: 'none' }} 
              muted playsInline 
            />

            {/* Layer 3: Top-Left Source Control (Promoted) */}
            <div style={{ position: 'fixed', top: 86, left: 24, zIndex: 400 }}>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileUpload}
              />
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(57, 255, 20, 0.1)', borderColor: 'var(--neon-green)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => useLiveCamera ? fileInputRef.current.click() : resetToCamera()}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 255, 65, 0.25)', borderRadius: '100px',
                  padding: '10px 20px', cursor: 'pointer',
                  fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                  color: useLiveCamera ? 'var(--text-primary)' : 'var(--neon-cyan)',
                  letterSpacing: '0.1em', transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                }}
                title={useLiveCamera ? "Upload Photo" : "Return to Camera"}
              >
                {useLiveCamera ? <Upload size={14} color="var(--neon-green)" /> : <RefreshCw size={14} color="var(--neon-cyan)" />}
                <span>{useLiveCamera ? "UPLOAD PHOTO" : "BACK TO LIVE"}</span>
              </motion.button>
            </div>

            {/* Layer 4: Floating UI Container (Bottom Controls) */}
            <div className="floating-ui-container">
              <button 
                className={`fab ${sidebarLeftOpen ? 'active' : ''}`} 
                onClick={toggleSidebarLeft}
                title="Toggle Features"
              >
                <motion.div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <motion.div animate={{ rotate: sidebarLeftOpen ? 180 : 0 }}>
                    {sidebarLeftOpen ? "✕" : <Settings size={14} />}
                  </motion.div>
                  <span>FEATURES</span>
                </motion.div>
              </button>
              <button 
                className={`fab-capture ${sidebarRightOpen ? 'active' : ''}`} 
                onClick={handleSaveClick}
                title="Snap & Save Art"
              >
                <motion.div animate={{ rotate: sidebarRightOpen ? -180 : 0 }}>
                  {sidebarRightOpen ? "✕" : <Camera size={20} />}
                </motion.div>
              </button>
              
              {/* Shortcuts Button */}
              <button 
                className={`fab ${sidebarShortcutsOpen ? 'active' : ''}`} 
                onClick={toggleSidebarShortcuts}
                title="Keyboard Shortcuts"
              >
                <motion.div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <motion.div animate={{ rotate: sidebarShortcutsOpen ? 180 : 0 }}>
                    {sidebarShortcutsOpen ? "✕" : <Keyboard size={14} />}
                  </motion.div>
                  <span>SHORTCUTS</span>
                </motion.div>
              </button>
            </div>

            {/* Toast notification */}
            <AnimatePresence>
              {notification && (
                <motion.div
                  key="toast"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.9 }}
                  style={{
                    position: 'fixed',
                    bottom: 100, left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 3000,
                    background: 'var(--bg-elevated)',
                    border: `1px solid ${notification.type === 'error' ? 'var(--neon-pink)' : 'var(--neon-green)'}`,
                    borderRadius: 8,
                    padding: '8px 20px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    fontWeight: 600,
                    color: notification.type === 'error' ? 'var(--neon-pink)' : 'var(--neon-green)',
                    boxShadow: notification.type === 'error' ? 'var(--glow-pink)' : 'var(--glow-green)',
                    letterSpacing: '0.08em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {notification.type !== 'error' ? '✓ ' : '⚠ '}{notification.msg}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
