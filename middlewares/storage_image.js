import multer from "multer"; // Importer multer
import path from "path"; 


var storage = multer.diskStorage({
    destination: function (_request, _file, callback) {
      callback(null, "./media")
    },
    filename: function (_request, file, callback) {
      callback(null, "image_" + Date.now() + path.extname(file.originalname))
    }
  })

  


export default  multer({ storage: storage })