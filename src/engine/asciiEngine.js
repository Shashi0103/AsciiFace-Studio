/**
 * asciiEngine.js
 * Converts a source canvas into ASCII art rendered on a destination canvas.
 */

export const CHAR_SETS = {
  basic: '@#S%?*+;:,.',
  standard: '@#8&oahs;:. ',
  advanced: '█▉▊▋▌▍▎▏▒░ ',
  unicode: '▓▒░█▐▌▄▀■□●○◆◇★☆',
  minimal: '@:. ',
  dense: '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. ',
  braille: '⣿⣷⣯⣟⡿⢿⣻⣽⣾⣼⣹⣺⣱⣲⣳⣵⣶⣸⡿⢿ ',
  custom: '',
};

/**
 * Render ASCII art onto a canvas from a source canvas.
 * @param {HTMLCanvasElement} outputCanvas
 * @param {HTMLCanvasElement} sourceCanvas
 * @param {Object} config
 */
export function renderAscii(outputCanvas, sourceCanvas, config) {
  const {
    charSet = 'standard',
    customChars = '',
    density = 60,
    fontSize = 8,
    fontFamily = 'JetBrains Mono',
    colorMode = 'color', // 'color' | 'green' | 'white' | 'custom'
    customColor = '#00FF41',
    faceBounds = null,
    invertChars = false,
  } = config;

  const chars = charSet === 'custom'
    ? (customChars || CHAR_SETS.standard)
    : (CHAR_SETS[charSet] || CHAR_SETS.standard);

  const charArray = chars.split('');
  if (invertChars) charArray.reverse();

  const ctx = outputCanvas.getContext('2d');
  const srcCtx = sourceCanvas.getContext('2d');

  const srcW = sourceCanvas.width;
  const srcH = sourceCanvas.height;

  // Determine sampling grid size
  const cols = Math.max(10, Math.round(density));
  const charW = srcW / cols;
  const charH = charW * 1.8; // approximate character aspect ratio
  const rows = Math.round(srcH / charH);

  outputCanvas.width = cols * fontSize * 0.62;
  outputCanvas.height = rows * fontSize;

  const outW = outputCanvas.width;
  const outH = outputCanvas.height;
  const cellW = outW / cols;
  const cellH = outH / rows;

  ctx.fillStyle = '#0A0A0F';
  ctx.fillRect(0, 0, outW, outH);
  ctx.font = `${fontSize}px "${fontFamily}", monospace`;
  ctx.textBaseline = 'top';

  const imgData = srcCtx.getImageData(0, 0, srcW, srcH);
  const pixels = imgData.data;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const sx = Math.floor((col / cols) * srcW);
      const sy = Math.floor((row / rows) * srcH);
      const idx = (sy * srcW + sx) * 4;

      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];

      const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      const charIdx = Math.floor(brightness * (charArray.length - 1));
      const char = charArray[charIdx] || ' ';

      // Adaptive density boost near face bounds
      let densityBoost = 1;
      if (faceBounds) {
        const nx = col / cols;
        const ny = row / rows;
        if (nx > faceBounds.x && nx < faceBounds.x + faceBounds.width &&
            ny > faceBounds.y && ny < faceBounds.y + faceBounds.height) {
          densityBoost = 1.5;
        }
      }

      if (colorMode === 'color') {
        ctx.fillStyle = `rgb(${r},${g},${b})`;
      } else if (colorMode === 'green') {
        const v = Math.round(brightness * 255);
        ctx.fillStyle = `rgb(0,${v},0)`;
      } else if (colorMode === 'custom') {
        ctx.fillStyle = customColor;
      } else {
        ctx.fillStyle = '#FFFFFF';
      }

      ctx.fillText(char, col * cellW, row * cellH);
    }
  }
}

/**
 * Get ASCII text (no canvas) for clipboard / TXT export.
 */
export function getAsciiText(sourceCanvas, config) {
  const {
    charSet = 'standard',
    customChars = '',
    density = 60,
    invertChars = false,
  } = config;

  const chars = charSet === 'custom'
    ? (customChars || CHAR_SETS.standard)
    : (CHAR_SETS[charSet] || CHAR_SETS.standard);

  const charArray = chars.split('');
  if (invertChars) charArray.reverse();

  const srcCtx = sourceCanvas.getContext('2d');
  const srcW = sourceCanvas.width;
  const srcH = sourceCanvas.height;

  const cols = Math.max(10, Math.round(density));
  const charW = srcW / cols;
  const charH = charW * 1.8;
  const rows = Math.round(srcH / charH);

  const imgData = srcCtx.getImageData(0, 0, srcW, srcH);
  const pixels = imgData.data;
  let text = '';

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const sx = Math.floor((col / cols) * srcW);
      const sy = Math.floor((row / rows) * srcH);
      const idx = (sy * srcW + sx) * 4;
      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      const charIdx = Math.floor(brightness * (charArray.length - 1));
      text += charArray[charIdx] || ' ';
    }
    text += '\n';
  }

  return text;
}
