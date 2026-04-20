/**
 * usePresets.js — Save and load named presets via localStorage
 */
import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';

const STORAGE_KEY = 'asciifacestudio_presets';

export function usePresets() {
  const { presets, setPresets, getSnapshot, loadSnapshot } = useAppStore();

  const savePreset = useCallback((name) => {
    const snapshot = getSnapshot();
    const newPreset = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
      data: snapshot,
    };

    const updated = [...presets, newPreset];
    setPresets(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    return newPreset;
  }, [presets, setPresets, getSnapshot]);

  const loadPreset = useCallback((id) => {
    const preset = presets.find(p => p.id === id);
    if (preset) {
      loadSnapshot(preset.data);
    }
  }, [presets, loadSnapshot]);

  const deletePreset = useCallback((id) => {
    const updated = presets.filter(p => p.id !== id);
    setPresets(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }, [presets, setPresets]);

  const renamePreset = useCallback((id, name) => {
    const updated = presets.map(p => p.id === id ? { ...p, name } : p);
    setPresets(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }, [presets, setPresets]);

  const initPresets = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPresets(JSON.parse(raw));
    } catch {}
  }, [setPresets]);

  return { presets, savePreset, loadPreset, deletePreset, renamePreset, initPresets };
}
