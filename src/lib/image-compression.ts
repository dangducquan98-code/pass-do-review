import imageCompression from 'browser-image-compression';

export async function compressImage(file: File) {
  const options = {
    maxSizeMB: 1, // Max size in MB
    maxWidthOrHeight: 1920, // Max width or height
    useWebWorker: true,
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
