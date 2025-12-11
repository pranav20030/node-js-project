import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("asjbdsjbn", path.join(process.cwd(), "public", "temp"))
    cb(null, path.join(process.cwd(), "public", "temp"));
    
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

console.log("storage", storage)

export const upload = multer({ storage });
