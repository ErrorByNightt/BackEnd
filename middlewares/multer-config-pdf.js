import multer, { diskStorage } from "multer";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

export default multer({
  storage: diskStorage({
    destination: (req, file, callback) => {
      const __dirname = dirname(fileURLToPath(import.meta.url));
      callback(null, join(__dirname, ".." + process.env.COURSEURL));
      //for docker
      // callback(null, "/media/");
    },
    filename: (req, file, callback) => {
      callback(null, file.originalname);
    },
  }),

  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(PDF|pdf)$/)) {
      return cb(new Error("Please upload a file"));
    }
    cb(undefined, true);
  },
}).single("url");