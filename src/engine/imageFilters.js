/**
 * imageFilters.js
 * Canvas-based pixel manipulation pipeline for image adjustments.
 */

/**
 * Apply all image control values to a canvas.
 * @param {HTMLCanvasElement} canvas - Source/destination canvas
 * @param {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} source - Image source
 * @param {Object} controls - Control values
 */
export function applyFilters(canvas, source, controls) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // Build CSS filter string for fast GPU-accelerated filters
  const {
    brightness = 100,
    contrast = 100,
    saturation = 100,
    blur = 0,
    hue = 0,
    invert = false,
    exposure = 0,
    mirror = false,
  } = controls;

  ctx.save();
  if (mirror) {
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
  }

  const exposureB = brightness + exposure * 20;

  ctx.filter = [
    `brightness(${exposureB}%)`,
    `contrast(${contrast}%)`,
    `saturate(${saturation}%)`,
    `hue-rotate(${hue}deg)`,
    blur > 0 ? `blur(${blur * 0.5}px)` : '',
    invert ? 'invert(1)' : '',
  ].filter(Boolean).join(' ');

  ctx.drawImage(source, 0, 0, w, h);
  ctx.restore();
  ctx.filter = 'none';

  // Pixel-level operations: sharpness, gamma, edge detection, noise
  if (controls.sharpness > 0 || controls.gamma !== 1 || controls.edgeDetect || controls.noiseReduction) {
    applyPixelOps(ctx, w, h, controls);
  }
}

function applyPixelOps(ctx, w, h, controls) {
  const imageData = ctx.getImageData(0, 0, w, h);
  let data = imageData.data;

  const gamma = controls.gamma ?? 1;
  const sharpness = controls.sharpness ?? 0;
  const noiseReduction = controls.noiseReduction ?? 0;
  const edgeDetect = controls.edgeDetect ?? false;

  // Gamma correction
  if (gamma !== 1) {
    const gammaCorrect = 1 / gamma;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 * Math.pow(data[i] / 255, gammaCorrect);
      data[i + 1] = 255 * Math.pow(data[i + 1] / 255, gammaCorrect);
      data[i + 2] = 255 * Math.pow(data[i + 2] / 255, gammaCorrect);
    }
  }

  // Noise reduction (box blur on pixel data)
  if (noiseReduction > 0) {
    data = boxBlur(data, w, h, Math.round(noiseReduction));
  }

  // Sharpness via unsharp mask
  if (sharpness > 0) {
    data = unsharpMask(data, w, h, sharpness / 100);
  }

  // Edge detection (Sobel)
  if (edgeDetect) {
    data = sobelEdge(data, w, h);
  }

  const newImageData = new ImageData(new Uint8ClampedArray(data), w, h);
  ctx.putImageData(newImageData, 0, 0);
}

function boxBlur(data, w, h, radius) {
  const output = new Uint8ClampedArray(data.length);
  const r = Math.max(1, radius);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let r_sum = 0, g_sum = 0, b_sum = 0, count = 0;
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const nx = Math.min(w - 1, Math.max(0, x + dx));
          const ny = Math.min(h - 1, Math.max(0, y + dy));
          const idx = (ny * w + nx) * 4;
          r_sum += data[idx];
          g_sum += data[idx + 1];
          b_sum += data[idx + 2];
          count++;
        }
      }
      const out = (y * w + x) * 4;
      output[out] = r_sum / count;
      output[out + 1] = g_sum / count;
      output[out + 2] = b_sum / count;
      output[out + 3] = data[out + 3];
    }
  }
  return output;
}

function unsharpMask(data, w, h, amount) {
  const blurred = boxBlur(data, w, h, 1);
  const output = new Uint8ClampedArray(data.length);

  for (let i = 0; i < data.length; i += 4) {
    output[i] = clamp(data[i] + amount * (data[i] - blurred[i]));
    output[i + 1] = clamp(data[i + 1] + amount * (data[i + 1] - blurred[i + 1]));
    output[i + 2] = clamp(data[i + 2] + amount * (data[i + 2] - blurred[i + 2]));
    output[i + 3] = data[i + 3];
  }
  return output;
}

function sobelEdge(data, w, h) {
  const output = new Uint8ClampedArray(data.length);
  const kx = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const ky = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let gx = 0, gy = 0;
      for (let ky_i = 0; ky_i < 3; ky_i++) {
        for (let kx_i = 0; kx_i < 3; kx_i++) {
          const idx = ((y + ky_i - 1) * w + (x + kx_i - 1)) * 4;
          const gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
          gx += gray * kx[ky_i * 3 + kx_i];
          gy += gray * ky[ky_i * 3 + kx_i];
        }
      }
      const mag = clamp(Math.sqrt(gx * gx + gy * gy));
      const out = (y * w + x) * 4;
      output[out] = mag;
      output[out + 1] = mag;
      output[out + 2] = mag;
      output[out + 3] = 255;
    }
  }
  return output;
}

function clamp(v) {
  return Math.min(255, Math.max(0, Math.round(v)));
}
