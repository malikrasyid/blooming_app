import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // sementara simpan file lokal
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname) // timestamp + ekstensi
    );
  },
});

const upload = multer({ storage });

export default upload;
