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
  // If it's already small enough, return it
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

      // Initial fast resize if image is huge
      let scale = 1.0;
      if (img.width > 2000 || img.height > 2000) {
        scale = 0.5;
      }

      let quality = 0.8;
      
      const attemptCompression = () => {
        if (scale < 0.1 || quality < 0.1) {
          resolve(canvas.toDataURL('image/jpeg', 0.1));
          return;
        }

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        const estimatedSize = compressedBase64.length * 0.75;

        if (estimatedSize <= targetSizeInBytes) {
          resolve(compressedBase64);
        } else {
          // Adjust parameters more aggressively to reduce iterations
          if (estimatedSize > targetSizeInBytes * 2) {
            quality *= 0.7;
            scale *= 0.8;
          } else {
            quality -= 0.15;
            if (quality < 0.3) {
              scale -= 0.2;
              quality = 0.5;
            }
          }
          setTimeout(attemptCompression, 0);
        }
      };

      attemptCompression();
    };
    img.onerror = () => reject(new Error("Image compression failed"));
    img.src = fullDataUrl;
  });
}
