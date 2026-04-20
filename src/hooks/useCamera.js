/**
 * useCamera.js — Camera stream management hook
 */
import { useRef, useState, useCallback, useEffect } from 'react';

export function useCamera() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [facing, setFacing] = useState('user');
  const [devices, setDevices] = useState([]);

  // Enumerate cameras on mount
  useEffect(() => {
    navigator.mediaDevices?.enumerateDevices().then(devs => {
      const cameras = devs.filter(d => d.kind === 'videoinput');
      setDevices(cameras);
    }).catch(() => {});
  }, []);

  const startCamera = useCallback(async (facingMode = 'user') => {
    stopCamera();
    setError(null);

    const constraints = {
      video: {
        facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.error('Camera play error:', err);
          }
        }
        setIsStreaming(true);
        setFacing(facingMode);
      }
    } catch (err) {
      setError(err.message || 'Camera access denied');
      setIsStreaming(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  const switchCamera = useCallback(async () => {
    const newFacing = facing === 'user' ? 'environment' : 'user';
    await startCamera(newFacing);
  }, [facing, startCamera]);

  /**
   * Capture current video frame to a canvas element.
   * @returns {HTMLCanvasElement|null}
   */
  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video || !isStreaming) return null;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas;
  }, [isStreaming]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return {
    videoRef,
    isStreaming,
    error,
    facing,
    devices,
    startCamera,
    stopCamera,
    switchCamera,
    captureFrame,
  };
}
