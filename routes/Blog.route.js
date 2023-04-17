import Express from "express";
import path from "path"; 
import multer from 'multer';
import * as blog from '../controllers/Blog.controller.js';
const upload = multer({ dest: './media' });

const router = Express.Router()

router.route("/add/coverImage/:id")
router.route('/add')
      .post(blog.ADDBlog)
router.route("/getOwnBlog/:username").get(blog.GetOwnBlog);
router.route('/getALL').get(blog.getAll)
router.route("/delete/:id").delete(blog.deleteBlog)
router.patch("/coverImage/:id",upload.single('coverImage'),blog.findOneAndUpdateImage)


router.put('/updateImage/:id', upload.single('coverImage'), blog.updateImage);
export default router