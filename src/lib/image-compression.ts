import imageCompression from 'browser-image-compression';

export async function compressImage(file: File) {
  const options = {
    maxSizeMB: 0.6, // Max size 600KB
    maxWidthOrHeight: 1600, // Max width/height for crisp display without bloat
    useWebWorker: true,
    initialQuality: 0.82,
    fileType: 'image/webp' as string, // Convert to webp
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Lỗi khi nén ảnh:', error);
    throw error;
  }
}
