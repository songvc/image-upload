import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 8080;
const uploadDir = path.join(process.cwd(), "public/uploads");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    cb(null, `${base}-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

app.use("/uploads", express.static(uploadDir));

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({ url });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on ${PORT}`);
});
