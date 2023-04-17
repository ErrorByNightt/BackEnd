import Express from "express";

import * as courseController from '../controllers/Courses.controller.js'
import multer from '../middlewares/multer-config-pdf.js';

const router = Express.Router()

router.route('/add')
    .post(multer, courseController.addCourse)
    router.get('/getall',courseController.getAllCourses)
    router.post('/deletecourse', courseController.deleteCourse)
    

export default router