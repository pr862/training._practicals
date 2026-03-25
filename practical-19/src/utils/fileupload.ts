import cloudinary from '../config/upload';
import { Readable } from 'stream';

interface CloudinaryResult {
  url: string;
  secure_url: string;
  public_id: string;
}

export const uploadToCloudinary = (buffer: Buffer, resourceType: 'image' | 'video' = 'image', folder?: string): Promise<CloudinaryResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        resource_type: resourceType,
        folder: folder || 'music-app',
        transformation: resourceType === 'image' ? [{ quality: 'auto', fetch_format: 'auto' }] : []
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            url: result.url!,
            secure_url: result.secure_url!,
            public_id: result.public_id!
          });
        } else {
          reject(new Error('Upload failed'));
        }
      }
    );

    const stream = Readable.from(buffer);
    stream.pipe(uploadStream);
  });
};
