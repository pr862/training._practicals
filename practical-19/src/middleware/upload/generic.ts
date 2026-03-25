import multer from 'multer';
import { memoryStorage } from 'multer';
import type { RequestHandler, Request, Response, NextFunction } from 'express';
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

interface UploaderConfig {
  fields: Array<{ name: string; maxCount: number }>;
  limits: multer.Options['limits'];
  mimetypes: Record<string, RegExp>;
  resourceTypes: Record<string, 'image' | 'video'>;
  folder: string;
}

const createGenericUploader = (config: UploaderConfig): RequestHandler => {
  const fileFilter = (req: any, file: any, cb: any) => {
    if (file.fieldname in config.mimetypes) {
      const mimeRegex = config.mimetypes[file.fieldname];
      if (!file.mimetype.match(mimeRegex)) {
        return cb(new Error(`Only ${file.fieldname} files allowed`), false);
      }
    } else {
      return cb(new Error('Invalid field'), false);
    }
    cb(null, true);
  };

  return (req: Request, res: Response, next: NextFunction) => {
    const upload = multer({
      storage: memoryStorage(),
      fileFilter,
      limits: config.limits
    }).fields(config.fields);

    upload(req, res, async (err) => {
      if (err) {
        return next(err);
      }

      for (const [fieldName, fieldFiles] of Object.entries(req.files || {})) {
        if (fieldFiles && fieldFiles.length > 0) {
          const file = fieldFiles[0];
          try {
            const result = await uploadToCloudinary(
              file.buffer, 
              config.resourceTypes[fieldName] || 'image', 
              config.folder
            );
            file.cloudinaryUrl = result.secure_url;
            file.publicId = result.public_id;
          } catch (error) {
            return next(error as Error);
          }
        }
      }

      next();
    });
  };
};

export const genericImageUploader = (folderType: 'artists' | 'albums' | 'playlists') => 
  createGenericUploader({
    fields: [{ name: 'image', maxCount: 1 }],
    mimetypes: { image: /^image\// },
    resourceTypes: { image: 'image' },
    folder: `music-app/${folderType}`,
    limits: { fileSize: 5 * 1024 * 1024 }
  });

export const uploadArtistImage = genericImageUploader('artists');
export const uploadAlbumImage = genericImageUploader('albums');
export const uploadPlaylistImage = genericImageUploader('playlists');

export const uploadTrackFields = createGenericUploader({
  fields: [
    { name: 'image', maxCount: 1 },
    { name: 'track', maxCount: 1 }
  ],
  mimetypes: { 
    image: /^image\//, 
    track: /^audio\/|application\/ogg$/ 
  },
  resourceTypes: { 
    image: 'image', 
    track: 'video' 
  },
  folder: 'music-app/tracks',
  limits: {
    fieldSize: 10 * 1024 * 1024,
    fileSize: 10 * 1024 * 1024,
    files: 2
  }
});

