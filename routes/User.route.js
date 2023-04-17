import Express from "express";

import * as UserController from '../controllers/User.controller.js'
import { check } from "express-validator";

import upload from '../middlewares/multer-config.js';

const router = Express.Router()

router.post('/register', UserController.register)

router.post('/login', UserController.login)
router.post("/send-confirmation-email", UserController.sendOTP)
router.get("/:id", UserController.getUserById)
router.put('/update/:id', UserController.updateUser);
router.put('/updateImage/:id', upload.single('image'), UserController.updateImage);
router.put('/state/:id', UserController.changeUserState)



export default router