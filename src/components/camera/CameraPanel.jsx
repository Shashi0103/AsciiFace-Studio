/**
 * CameraPanel.jsx — Camera feed only (Simplified for Live Mode)
 * Accepts a shared camera object from App to avoid dual-stream conflicts.
 */
import { useEffect } from 'react';
import { Camera, FlipHorizontal, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function CameraPanel({ camera }) {
  const {
    videoRef, isStreaming, error, facing,
    startCamera, stopCamera, switchCamera,
  } = camera;

  const { setCameraActive } = useAppStore();

  useEffect(() => {
    setCameraActive(isStreaming);
  }, [isStreaming, setCameraActive]);

  // Ensure camera starts on mount
  useEffect(() => {
    if (!isStreaming) {
      startCamera(facing);
    }
  }, [startCamera, facing, isStreaming]);

  return (
    <div className="camera-pip" title="Camera Preview">
      {/* Video preview - PIP Style */}
      <video
        ref={videoRef}
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover',
          transform: facing === 'user' ? 'scaleX(-1)' : 'none',
          background: '#000',
        }}
        muted playsInline
      />

      {/* Mini status indicator */}
      {isStreaming && (
        <div style={{
          position: 'absolute', top: 6, left: 6,
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--neon-green)',
          boxShadow: '0 0 8px var(--neon-green)',
          animation: 'pulse-glow 1s infinite',
        }} />
      )}

      {/* Mini Mode Toggle on hover (optional, but keep it clean) */}
      {!isStreaming && (
        <button 
          onClick={() => startCamera(facing)}
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.4)', color: '#fff',
            border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: 10,
            fontWeight: 700, letterSpacing: '0.1em'
          }}
        >
          START CAM
        </button>
      )}

      {/* Switch Camera Button */}
      {isStreaming && (
        <button
          onClick={(e) => { e.stopPropagation(); switchCamera(); }}
          style={{
            position: 'absolute', bottom: 6, right: 6,
            background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff', padding: 4, borderRadius: 4,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease', backdropFilter: 'blur(4px)',
            zIndex: 10
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,255,65,0.2)'; e.currentTarget.style.borderColor = 'var(--neon-green)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
          title="Switch Camera (Front/Rear)"
        >
          <FlipHorizontal size={12} />
        </button>
      )}

      {/* Error display */}
      {error && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(255,0,110,0.9)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 8, fontSize: 8, textAlign: 'center',
          fontFamily: 'var(--font-mono)'
        }}>
          CAM ERR
        </div>
      )}
    </div>
  );
}
