import { AppError } from './errors.js';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

type CloudinaryError = Error & {
  http_code?: number;
};

function isCloudinaryAuthError(error: unknown): error is CloudinaryError {
  return (
    error instanceof Error &&
    'http_code' in error &&
    [400, 401, 403].includes(Number((error as CloudinaryError).http_code))
  );
}

export async function uploadBuffer(file: Express.Multer.File, folder: string) {
  if (!isCloudinaryConfigured()) {
    throw new AppError(503, 'Cloudinary is not configured');
  }

  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: 'image',
    });

    return result.secure_url;
  } catch (error) {
    if (isCloudinaryAuthError(error)) {
      throw new AppError(503, 'Cloudinary upload failed. Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server/.env.');
    }

    throw error;
  }
}