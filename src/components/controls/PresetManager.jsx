/**
 * PresetManager.jsx — Save, load, rename, delete named presets
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookMarked, Plus, Trash2, Play, Edit2, Check, X } from 'lucide-react';
import { usePresets } from '../../hooks/usePresets';

export default function PresetManager() {
  const { presets, savePreset, loadPreset, deletePreset, renamePreset } = usePresets();
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    const name = newName.trim() || `Preset ${presets.length + 1}`;
    savePreset(name);
    setNewName('');
  };

  const handleRename = (id) => {
    if (editName.trim()) renamePreset(id, editName.trim());
    setEditingId(null);
  };

  return (
    <div className="panel">
      <button
        className="panel-header"
        style={{ width: '100%', cursor: 'pointer', background: 'none', border: 'none', justifyContent: 'space-between' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <BookMarked size={13} />
          Presets
          {presets.length > 0 && (
            <span className="tag tag-green">{presets.length}</span>
          )}
        </span>
        <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>{isOpen ? '▲' : '▼'}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '10px 14px' }}>
              {/* Save new preset */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  placeholder="Preset name..."
                  style={{
                    flex: 1, padding: '6px 10px',
                    background: 'var(--bg-glass-light)',
                    border: '1px solid var(--border-dim)',
                    borderRadius: 6, color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)', fontSize: 12,
                    outline: 'none',
                  }}
                />
                <button className="btn-neon primary" style={{ padding: '6px 10px', fontSize: 11 }} onClick={handleSave}>
                  <Plus size={13} />
                </button>
              </div>

              {/* Preset list */}
              {presets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '12px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>
                  No presets saved yet
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 160, overflowY: 'auto' }}>
                  {presets.map(preset => (
                    <div
                      key={preset.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '6px 8px',
                        background: 'var(--bg-glass-light)',
                        border: '1px solid var(--border-dim)',
                        borderRadius: 6,
                      }}
                    >
                      {editingId === preset.id ? (
                        <>
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRename(preset.id)}
                            autoFocus
                            style={{
                              flex: 1, background: 'transparent', border: 'none',
                              color: 'var(--text-primary)', fontFamily: 'var(--font-mono)',
                              fontSize: 11, outline: 'none',
                            }}
                          />
                          <button className="btn-icon" style={{ width: 24, height: 24 }} onClick={() => handleRename(preset.id)}>
                            <Check size={11} />
                          </button>
                          <button className="btn-icon" style={{ width: 24, height: 24 }} onClick={() => setEditingId(null)}>
                            <X size={11} />
                          </button>
                        </>
                      ) : (
                        <>
                          <span style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {preset.name}
                          </span>
                          <button className="btn-icon" style={{ width: 24, height: 24 }} onClick={() => loadPreset(preset.id)} title="Load">
                            <Play size={10} />
                          </button>
                          <button className="btn-icon" style={{ width: 24, height: 24 }} onClick={() => { setEditingId(preset.id); setEditName(preset.name); }} title="Rename">
                            <Edit2 size={10} />
                          </button>
                          <button className="btn-icon" style={{ width: 24, height: 24, borderColor: 'rgba(255,0,110,0.2)', color: 'var(--neon-pink)' }} onClick={() => deletePreset(preset.id)} title="Delete">
                            <Trash2 size={10} />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
