import multer, { diskStorage } from "multer";
import { join, dirname } from "path";
import { fileURLToPath } from "url";


var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb (null, 'media/')
    },
    filename: function(req,file,cb){
       // let ext = path.extname(file.originalname)
        cb(null, Date.now() + file.originalname)
    }
})


var uploadStock = multer({
    storage: storage,
limits: {
    fileSize: 1024 * 1024 * 2
}
})

export default uploadStock;