/**
 * effects.js
 * Aesthetic effect overlays applied after ASCII/pixel rendering.
 * Each effect receives a canvas context and modifies it in place.
 */

export const EFFECTS = {
  none: 'None',
  cyberpunk: 'Cyberpunk Neon',
  matrix: 'Matrix Rain',
  bw: 'Black & White',
  sepia: 'Vintage / Sepia',
  thermal: 'Thermal Vision',
  glitch: 'Glitch Distortion',
  holographic: 'Holographic',
};

/**
 * Apply a named effect to a canvas.
 * @param {HTMLCanvasElement} canvas
 * @param {string} effectName
 */
export function applyEffect(canvas, effectName) {
  if (!effectName || effectName === 'none') return;

  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  switch (effectName) {
    case 'cyberpunk':
      applyCyberpunk(ctx, w, h);
      break;
    case 'bw':
      applyBW(ctx, w, h);
      break;
    case 'sepia':
      applySepia(ctx, w, h);
      break;
    case 'thermal':
      applyThermal(ctx, w, h);
      break;
    case 'glitch':
      applyGlitch(ctx, w, h);
      break;
    case 'holographic':
      applyHolographic(ctx, w, h);
      break;
    default:
      break;
  }
}

function applyCyberpunk(ctx, w, h) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Boost cyan and magenta
    data[i] = Math.min(255, r + 60);      // Push red
    data[i + 1] = Math.min(255, g + 20);  // slight green
    data[i + 2] = Math.min(255, b + 80);  // Heavy blue/cyan
  }
  ctx.putImageData(imageData, 0, 0);

  // Neon scan lines
  ctx.fillStyle = 'rgba(0, 255, 255, 0.04)';
  for (let y = 0; y < h; y += 4) {
    ctx.fillRect(0, y, w, 1);
  }

  // Edge glow overlay
  const gradient = ctx.createRadialGradient(w / 2, h / 2, h * 0.1, w / 2, h / 2, h * 0.7);
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, 'rgba(255,0,255,0.12)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
}

function applyBW(ctx, w, h) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }
  ctx.putImageData(imageData, 0, 0);
}

function applySepia(ctx, w, h) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
    data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
    data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
  }
  ctx.putImageData(imageData, 0, 0);

  // Vignette
  const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.8);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(60,30,0,0.5)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
}

function applyThermal(ctx, w, h) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const heat = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
    const [r, g, b] = thermalColor(heat);
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }
  ctx.putImageData(imageData, 0, 0);
}

function thermalColor(t) {
  // Black → Blue → Cyan → Green → Yellow → Red → White
  if (t < 0.166) { const v = t / 0.166; return [0, 0, Math.round(128 + v * 127)]; }
  if (t < 0.333) { const v = (t - 0.166) / 0.166; return [0, Math.round(v * 255), 255]; }
  if (t < 0.5) { const v = (t - 0.333) / 0.166; return [0, 255, Math.round(255 - v * 255)]; }
  if (t < 0.666) { const v = (t - 0.5) / 0.166; return [Math.round(v * 255), 255, 0]; }
  if (t < 0.833) { const v = (t - 0.666) / 0.166; return [255, Math.round(255 - v * 255), 0]; }
  const v = (t - 0.833) / 0.166;
  return [255, Math.round(v * 255), Math.round(v * 255)];
}

function applyGlitch(ctx, w, h) {
  const imageData = ctx.getImageData(0, 0, w, h);

  // Horizontal slice displacement
  const slices = 8 + Math.floor(Math.random() * 12);
  for (let i = 0; i < slices; i++) {
    const y = Math.floor(Math.random() * h);
    const sliceH = 1 + Math.floor(Math.random() * 8);
    const shift = (Math.random() - 0.5) * 30;

    const slice = ctx.getImageData(0, y, w, sliceH);
    ctx.putImageData(slice, shift, y);
  }

  // RGB channel split
  const original = ctx.getImageData(0, 0, w, h);
  const shifted = ctx.getImageData(0, 0, w, h);
  const offset = 3 + Math.floor(Math.random() * 5);

  const od = original.data;
  const sd = shifted.data;

  for (let i = 0; i < od.length; i += 4) {
    const shiftedIdx = Math.min(od.length - 4, i + offset * 4);
    od[i] = sd[shiftedIdx]; // shift red channel right
  }

  ctx.putImageData(original, 0, 0);
}

function applyHolographic(ctx, w, h) {
  // Rainbow gradient overlay
  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, 'rgba(255,0,100,0.08)');
  gradient.addColorStop(0.25, 'rgba(0,255,255,0.08)');
  gradient.addColorStop(0.5, 'rgba(255,0,200,0.08)');
  gradient.addColorStop(0.75, 'rgba(0,100,255,0.08)');
  gradient.addColorStop(1, 'rgba(100,255,0,0.08)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  // Scanlines
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  for (let y = 0; y < h; y += 3) {
    ctx.fillRect(0, y, w, 1);
  }

  // Shimmer lines
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const y = Math.random() * h;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
}
