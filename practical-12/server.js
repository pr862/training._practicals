const path = require("path");

const express = require("express");
const multer = require("multer");

const app = express();

app.use('/src', express.static(path.join(__dirname, 'src')));

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./image"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const filter = (req, file, cb) => {
  if (file.mimetype === "application/pdf" || file.mimetype === "application/msword") {
    cb(null, true);
  } else {
    cb(new Error("Only pdf and docs file allowed!"));
    console.log("Only pdf and docs file allowed!");
  }
};


const upload = multer({ limits:{fileSize: 1024 * 10} ,storage: fileStorageEngine, fileFilter: filter});

app.post("/single", upload.single("image"), (req, res) => {
  if (req.file) {
    console.log(req.file);
    res.send("File uploaded successfully");
  }
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    console.log(err);
    console.log("File size is too large, Maximum size is 10kb");
  }
  res.status(400).json({
    success: false,
    message: err.message || "An error occurred",
  });
});

app.listen(3000);
console.log("server is running on http://localhost:3000");

