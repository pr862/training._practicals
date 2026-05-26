interface CloudinaryUploadResponse {
  secure_url: string;
  error?: {
    message?: string;
  };
}

const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const uploadFolder = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_FOLDER;

export type UploadImageSource =
  | string
  | File
  | {
    uri: string;
    name?: string;
    type?: string;
  };

const getFileExtension = (filename: string) => {
  const cleanName = filename.split("?")[0] || "";
  return cleanName.includes(".") ? cleanName.split(".").pop()?.toLowerCase() : undefined;
};

const getContentType = (filename: string, fallback?: string) => {
  if (fallback) return fallback;

  const extension = getFileExtension(filename);
  if (extension === "jpg" || extension === "jpeg") return "image/jpeg";
  if (extension === "png") return "image/png";
  if (extension === "webp") return "image/webp";
  if (extension === "gif") return "image/gif";
  return "image/jpeg";
};

const isReactNativeUploadSource = (
  source: UploadImageSource
): source is { uri: string; name?: string; type?: string } => (
  typeof source === "object" && source !== null && "uri" in source
);

const getUploadFile = (source: UploadImageSource) => {
  if (typeof File !== "undefined" && source instanceof File) {
    return source;
  }

  if (typeof source === "string") {
    const filename = source.split("/").pop()?.split("?")[0] || "upload.jpg";
    return {
      uri: source,
      name: filename,
      type: getContentType(filename),
    };
  }

  if (isReactNativeUploadSource(source)) {
    const filename = source.name || source.uri.split("/").pop()?.split("?")[0] || "upload.jpg";
    return {
      uri: source.uri,
      name: filename,
      type: getContentType(filename, source.type),
    };
  }

  return source;
};

export const uploadImageToCloudinary = async (source: UploadImageSource) => {
  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary environment variables are missing");
  }

  const formData = new FormData();

  formData.append("file", getUploadFile(source) as Blob);

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

  const data = (await response.json()) as CloudinaryUploadResponse;

  if (!response.ok) {
    throw new Error(data.error?.message || "Image upload failed");
  }

  return data.secure_url;
};
