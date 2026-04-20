/**
 * useAppStore.js — Zustand global state for AsciiFace Studio
 */
import { create } from 'zustand';

const DEFAULT_CONTROLS = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  sharpness: 0,
  blur: 0,
  exposure: 0,
  gamma: 1,
  hue: 0,
  invert: false,
  edgeDetect: false,
  noiseReduction: 0,
  mirror: true,
};

const DEFAULT_ASCII_CONFIG = {
  charSet: 'standard',
  customChars: '',
  density: 120,
  fontFamily: 'JetBrains Mono',
  colorMode: 'color',
  customColor: '#00FF41',
  invertChars: false,
  autoCenter: false,
};

const DEFAULT_PIXEL_CONFIG = {
  blockSize: 8,
  showGrid: false,
  palette: null,
};

export const useAppStore = create((set, get) => ({
  // App initialization state
  hasEnteredStudio: false,
  enterStudio: () => set({ hasEnteredStudio: true }),
  exitStudio: () => set({ hasEnteredStudio: false }),

  // Application Display Mode
  mode: 'ascii', // 'ascii' | 'pixel'
  setMode: (mode) => set({ mode }),

  // Camera & Media Source state
  cameraActive: false,
  cameraFacing: 'user',   // 'user' | 'environment'
  liveMode: true,
  mediaSource: null,     // HTMLImageElement for uploaded photo
  useLiveCamera: true,   // true = camera, false = uploaded image
  setCameraActive: (v) => set({ cameraActive: v }),
  setCameraFacing: (v) => set({ cameraFacing: v }),
  setLiveMode: (v) => set({ liveMode: v }),
  setMediaSource: (image) => set({ mediaSource: image, useLiveCamera: false }),
  resetToCamera: () => set({ mediaSource: null, useLiveCamera: true }),


  // Image controls
  controls: { ...DEFAULT_CONTROLS },
  setControl: (key, value) => set(state => ({
    controls: { ...state.controls, [key]: value }
  })),
  resetControls: () => set({ controls: { ...DEFAULT_CONTROLS } }),

  // ASCII config
  asciiConfig: { ...DEFAULT_ASCII_CONFIG },
  setAsciiConfig: (key, value) => set(state => ({
    asciiConfig: { ...state.asciiConfig, [key]: value }
  })),

  // Pixel config
  pixelConfig: { ...DEFAULT_PIXEL_CONFIG },
  setPixelConfig: (key, value) => set(state => ({
    pixelConfig: { ...state.pixelConfig, [key]: value }
  })),

  // Active aesthetic effect
  activeEffect: 'none',
  setActiveEffect: (effect) => set({ activeEffect: effect }),

  // Face bounds (for adaptive ASCII)
  faceBounds: null,
  setFaceBounds: (bounds) => set({ faceBounds: bounds }),

  // Processing state
  isProcessing: false,
  setIsProcessing: (v) => set({ isProcessing: v }),

  // Zoom level for output
  zoom: 1,
  setZoom: (z) => set({ zoom: Math.max(0.25, Math.min(4, z)) }),

  // UI State
  sidebarLeftOpen: false,
  sidebarRightOpen: false,
  sidebarShortcutsOpen: false,
  toggleSidebarLeft: () => set(state => ({ sidebarLeftOpen: !state.sidebarLeftOpen })),
  toggleSidebarRight: () => set(state => ({ sidebarRightOpen: !state.sidebarRightOpen })),
  toggleSidebarShortcuts: () => set(state => ({ sidebarShortcutsOpen: !state.sidebarShortcutsOpen })),
  setSidebarLeftOpen: (v) => set({ sidebarLeftOpen: v }),
  setSidebarRightOpen: (v) => set({ sidebarRightOpen: v }),
  setSidebarShortcutsOpen: (v) => set({ sidebarShortcutsOpen: v }),

  // Presets (persisted separately via usePresets hook)

  presets: [],
  setPresets: (presets) => set({ presets }),

  // Export filename
  exportFilename: 'ascii-art',
  setExportFilename: (name) => set({ exportFilename: name }),

  // Captured snapshot for Pose Capture
  lastSnapshot: null,
  lastSnapshotText: null,
  setLastSnapshot: (snap, text) => set({ lastSnapshot: snap, lastSnapshotText: text }),

  // Full state snapshot for presets
  getSnapshot: () => {
    const s = get();
    return {
      mode: s.mode,
      controls: { ...s.controls },
      asciiConfig: { ...s.asciiConfig },
      pixelConfig: { ...s.pixelConfig },
      activeEffect: s.activeEffect,
    };
  },

  loadSnapshot: (snapshot) => set({
    mode: snapshot.mode,
    controls: { ...DEFAULT_CONTROLS, ...snapshot.controls },
    asciiConfig: { ...DEFAULT_ASCII_CONFIG, ...snapshot.asciiConfig },
    pixelConfig: { ...DEFAULT_PIXEL_CONFIG, ...snapshot.pixelConfig },
    activeEffect: snapshot.activeEffect ?? 'none',
  }),
}));
