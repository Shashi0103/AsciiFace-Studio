/**
 * pixelEngine.js
 * Pixelates a source canvas and renders to an output canvas.
 */

/**
 * Render pixelated art onto outputCanvas from sourceCanvas.
 * @param {HTMLCanvasElement} outputCanvas
 * @param {HTMLCanvasElement} sourceCanvas
 * @param {Object} config
 */
export function renderPixelArt(outputCanvas, sourceCanvas, config) {
  const {
    blockSize = 8,
    palette = null, // null = full color, or array of hex colors for palette quantization
    showGrid = false,
    gridColor = 'rgba(0,0,0,0.3)',
  } = config;

  const srcCtx = sourceCanvas.getContext('2d');
  const outCtx = outputCanvas.getContext('2d');

  outputCanvas.width = sourceCanvas.width;
  outputCanvas.height = sourceCanvas.height;

  const w = sourceCanvas.width;
  const h = sourceCanvas.height;
  const bs = Math.max(2, blockSize);

  const imgData = srcCtx.getImageData(0, 0, w, h);
  const pixels = imgData.data;

  outCtx.clearRect(0, 0, w, h);
  outCtx.fillStyle = '#0A0A0F';
  outCtx.fillRect(0, 0, w, h);

  for (let y = 0; y < h; y += bs) {
    for (let x = 0; x < w; x += bs) {
      // Average color in block
      let r = 0, g = 0, b = 0, count = 0;
      for (let dy = 0; dy < bs && y + dy < h; dy++) {
        for (let dx = 0; dx < bs && x + dx < w; dx++) {
          const idx = ((y + dy) * w + (x + dx)) * 4;
          r += pixels[idx];
          g += pixels[idx + 1];
          b += pixels[idx + 2];
          count++;
        }
      }
      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);

      let color = `rgb(${r},${g},${b})`;

      // Optional palette quantization
      if (palette && palette.length > 0) {
        color = nearestColor(r, g, b, palette);
      }

      outCtx.fillStyle = color;
      outCtx.fillRect(x, y, bs, bs);

      if (showGrid) {
        outCtx.strokeStyle = gridColor;
        outCtx.lineWidth = 0.5;
        outCtx.strokeRect(x, y, bs, bs);
      }
    }
  }
}

function nearestColor(r, g, b, palette) {
  let minDist = Infinity;
  let nearest = palette[0];

  for (const hex of palette) {
    const pr = parseInt(hex.slice(1, 3), 16);
    const pg = parseInt(hex.slice(3, 5), 16);
    const pb = parseInt(hex.slice(5, 7), 16);
    const dist = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2;
    if (dist < minDist) {
      minDist = dist;
      nearest = hex;
    }
  }

  return nearest;
}
