/**
 * Fast resize function that does a single-pass resize and quality reduction.
 * Much faster than the iterative compressBase64Image.
 */
export async function fastResizeImage(fullDataUrl: string, maxDimension: number, quality: number = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxDimension) {
          height *= maxDimension / width;
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width *= maxDimension / height;
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error("Image resize failed"));
    img.src = fullDataUrl;
  });
}

/**
 * Compresses a data URL image to be under a certain size in bytes.
 * This is useful for Firestore document limits (1MB).
 */
export async function compressBase64Image(fullDataUrl: string, mimeType: string, targetSizeInBytes: number = 800000): Promise<string> {
  // If it's already small enough, return it immediately to preserve absolute pixel perfection!
  const currentSize = (fullDataUrl.length * 3) / 4;
  if (currentSize <= targetSizeInBytes) {
    return fullDataUrl;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // We want to keep HD quality.
      // For results, we keep max dimension up to 1200px.
      // For background cache source images, we can go up to 1000px.
      const isSourceImage = targetSizeInBytes < 200000;
      const maxDim = isSourceImage ? 1000 : 1200;
      
      let width = img.width;
      let height = img.height;
      
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      // Try high quality first (0.85). Looks completely pristine and HD!
      let quality = 0.85;
      let resultBase64 = canvas.toDataURL('image/jpeg', quality);
      let estimatedSize = resultBase64.length * 0.75;
      
      // If still too large, adjust to a very high-quality 0.75.
      if (estimatedSize > targetSizeInBytes) {
        quality = 0.75;
        resultBase64 = canvas.toDataURL('image/jpeg', quality);
        estimatedSize = resultBase64.length * 0.75;
      }
      
      // Final safe compression fallback
      if (estimatedSize > targetSizeInBytes) {
        quality = 0.60;
        resultBase64 = canvas.toDataURL('image/jpeg', quality);
      }
      
      console.log(`Smart compression done: ${img.width}x${img.height} -> ${width}x${height}, quality: ${quality}, size: ${Math.round((resultBase64.length * 0.75) / 1024)}KB`);
      resolve(resultBase64);
    };
    img.onerror = () => reject(new Error("Image compression failed"));
    img.src = fullDataUrl;
  });
}
