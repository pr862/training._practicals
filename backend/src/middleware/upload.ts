import multer, { StorageEngine, Multer } from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video/');
    return {
      folder: "recipe-uploads",
      resource_type: isVideo ? 'video' : 'image',
      format: isVideo ? undefined : "jpg",
      public_id: `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
    };
  },
});

const upload: Multer = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/mpeg", "video/webm", "video/quicktime"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed") as any);
    }
  },
});

export default upload;
