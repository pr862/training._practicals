import { assertRequiredFile } from "./validation";

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const uploadFolder = import.meta.env.VITE_CLOUDINARY_UPLOAD_FOLDER;

interface CloudinaryUploadResponse {
  secure_url: string;
}

export const uploadImageToCloudinary = async (file: File) => {
  const validatedFile = assertRequiredFile(file);

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary environment variables are missing");
  }

  const formData = new FormData();
  formData.append("file", validatedFile);
  formData.append("upload_preset", uploadPreset);

  if (uploadFolder) {
    formData.append("folder", uploadFolder);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Image upload failed");
  }

  const data = (await response.json()) as CloudinaryUploadResponse;
  return data.secure_url;
};
