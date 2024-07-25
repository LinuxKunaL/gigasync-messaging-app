import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, `../data/user-${req.body._id}`));
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) + ".jpg";
    cb(null, "Avatar" + ext);
  },
});
const upload = multer({ storage: storage });

export { upload };
