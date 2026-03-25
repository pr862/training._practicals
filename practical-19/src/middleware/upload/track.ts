import multer from 'multer';
import { memoryStorage } from 'multer';
import type { RequestHandler } from 'express';
import { uploadToCloudinary } from '../../utils/fileupload';

declare module 'express-serve-static-core' {
  interface Request {
    file?: {
      buffer: Buffer;
      cloudinaryUrl?: string;
      publicId?: string;
    };
    files?: {
      [key: string]: Array<{
        buffer: Buffer;
        cloudinaryUrl?: string;
        publicId?: string;
      }>;
    };
  }
}

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.fieldname === 'track') {
    if (!file.mimetype.match(/^audio\/|application\/ogg$/)) {
      return cb(new Error('Only audio files allowed for track'), false);
    }
  } else if (file.fieldname === 'image') {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files allowed'), false);
    }
  } else {
    return cb(new Error('Invalid field'), false);
  }
  cb(null, true);
};

const createTrackUploader: RequestHandler = (req, res, next) => {
  const upload = multer({
    storage: memoryStorage(),
    fileFilter,
    limits: {
      fieldSize: 10 * 1024 * 1024,
      fileSize: 10 * 1024 * 1024,
      files: 2
    }
  }).fields([
    { name: 'track', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ]);

  upload(req, res, async (err) => {
    if (err) {
      return next(err);
    }

    if (req.files?.image && req.files.image.length > 0) {
      const imageFile = req.files.image[0];
      try {
        const result = await uploadToCloudinary(imageFile.buffer, 'image', 'music-app/tracks');
        imageFile.cloudinaryUrl = result.secure_url;
        imageFile.publicId = result.public_id;
      } catch (error) {
        return next(error as Error);
      }
    }

    if (req.files?.track && req.files.track.length > 0) {
      const trackFile = req.files.track[0];
      try {
        const result = await uploadToCloudinary(trackFile.buffer, 'video', 'music-app/tracks/audio');
        trackFile.cloudinaryUrl = result.secure_url;
        trackFile.publicId = result.public_id;
      } catch (error) {
        return next(error as Error);
      }
    }

    next();
  });
};

export const uploadTrackFields = createTrackUploader;
