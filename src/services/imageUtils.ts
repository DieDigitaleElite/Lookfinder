/**
 * Compresses a base64 image string to be under a certain size in bytes.
 * This is useful for Firestore document limits (1MB).
 */
export async function compressBase64Image(base64Data: string, mimeType: string, targetSizeInBytes: number = 800000): Promise<string> {
  // If it's already small enough, return it
  const currentSize = (base64Data.length * 3) / 4;
  if (currentSize <= targetSizeInBytes) {
    return base64Data;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Start with a high quality and reduce if needed
      let quality = 0.9;
      let scale = 1.0;

      const attemptCompression = () => {
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Use jpeg for better compression than png
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        const compressedData = compressedBase64.split(',')[1];
        const compressedSize = (compressedData.length * 3) / 4;

        if (compressedSize <= targetSizeInBytes || (quality <= 0.1 && scale <= 0.1)) {
          resolve(compressedBase64);
        } else {
          // Reduce quality or scale and try again
          if (quality > 0.3) {
            quality -= 0.1;
          } else {
            scale -= 0.1;
          }
          attemptCompression();
        }
      };

      attemptCompression();
    };
    img.onerror = (err) => reject(err);
    img.src = `data:${mimeType};base64,${base64Data}`;
  });
}
