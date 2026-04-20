/**
 * useCanvas.js — Utilities for working with HTML5 Canvas
 */
import { useRef, useCallback } from 'react';
import { applyFilters } from '../engine/imageFilters';
import { renderAscii } from '../engine/asciiEngine';
import { renderPixelArt } from '../engine/pixelEngine';
import { applyEffect } from '../engine/effects';

export function useCanvas() {
  const workingCanvasRef = useRef(null);

  const getWorkingCanvas = useCallback((width = 640, height = 480) => {
    if (!workingCanvasRef.current) {
      workingCanvasRef.current = document.createElement('canvas');
    }
    const canvas = workingCanvasRef.current;
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }, []);

  /**
   * Full pipeline: source → filter → ascii/pixel → effect → output canvas
   */
  const processImage = useCallback(({
    source,      // HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
    outputCanvas,
    controls,
    mode,
    asciiConfig,
    pixelConfig,
    activeEffect,
    faceBounds,
  }) => {
    if (!source || !outputCanvas) return;

    const srcW = source.videoWidth || source.naturalWidth || source.width;
    const srcH = source.videoHeight || source.naturalHeight || source.height;

    if (!srcW || !srcH) return;

    // Step 1: Draw source into a working canvas and apply image filters
    const filterCanvas = getWorkingCanvas(srcW, srcH);
    applyFilters(filterCanvas, source, controls);

    // Step 2: Render ASCII or Pixel art into output canvas
    if (mode === 'ascii') {
      renderAscii(outputCanvas, filterCanvas, { ...asciiConfig, faceBounds });
    } else {
      renderPixelArt(outputCanvas, filterCanvas, pixelConfig);
    }

    // Step 3: Apply aesthetic effect overlay
    if (activeEffect && activeEffect !== 'none') {
      applyEffect(outputCanvas, activeEffect);
    }
  }, [getWorkingCanvas]);

  /**
   * Convert canvas to DataURL.
   */
  const canvasToDataURL = useCallback((canvas, format = 'image/png', quality = 0.92) => {
    return canvas.toDataURL(format, quality);
  }, []);

  /**
   * Trigger file download from a canvas.
   */
  const downloadCanvas = useCallback((canvas, filename, format = 'image/png') => {
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }, format, 0.92);
  }, []);

  return {
    processImage,
    canvasToDataURL,
    downloadCanvas,
  };
}
