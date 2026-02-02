import express, { Request, Response, NextFunction } from "express";
import path from "path";
import multer, { MulterError, StorageEngine, FileFilterCallback } from "multer";

const app = express();

app.use(express.static(path.join(__dirname, "..")));

const fileStorageEngine: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, "./image");
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (file.mimetype === "application/pdf" || file.mimetype === "application/msword" || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and DOC files are allowed!"));
  }
};

const upload = multer({
  storage: fileStorageEngine,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 10 }, 
});

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/single", upload.single("image"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  
  console.log(req.file);
  res.status(200).json({
    success: true,
    message: "File uploaded successfully",
    file: req.file.filename
  });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size is too large. Maximum size is 10KB",
      });
    }
  }
  
  res.status(400).json({
    success: false,
    message: err.message || "an unknown error occurred",
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
