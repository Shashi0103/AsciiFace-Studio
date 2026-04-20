/**
 * faceDetection.js
 * Attempts to use the native FaceDetector API, with graceful fallback
 * to a center-weighted bounding box.
 */

let faceDetector = null;
let apiSupported = null;

export async function initFaceDetection() {
  if (apiSupported !== null) return apiSupported;

  if ('FaceDetector' in window) {
    try {
      faceDetector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 3 });
      apiSupported = true;
    } catch {
      apiSupported = false;
    }
  } else {
    apiSupported = false;
  }

  return apiSupported;
}

/**
 * Detect faces in an image element/canvas.
 * Returns normalized bounding boxes [{x, y, width, height}] or a center fallback.
 * @param {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} source
 * @returns {Promise<Array<{x:number,y:number,width:number,height:number}>>}
 */
export async function detectFaces(source) {
  if (apiSupported === null) {
    await initFaceDetection();
  }

  if (apiSupported && faceDetector) {
    try {
      const faces = await faceDetector.detect(source);
      const w = source.videoWidth || source.naturalWidth || source.width;
      const h = source.videoHeight || source.naturalHeight || source.height;

      return faces.map(f => ({
        x: f.boundingBox.x / w,
        y: f.boundingBox.y / h,
        width: f.boundingBox.width / w,
        height: f.boundingBox.height / h,
      }));
    } catch {
      return [centerFallback()];
    }
  }

  return [centerFallback()];
}

/**
 * Center-weighted fallback: assume face is in the center 40% of the frame.
 */
function centerFallback() {
  return { x: 0.3, y: 0.15, width: 0.4, height: 0.5 };
}
