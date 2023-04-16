import Express from "express";

import * as UserController from '../Controllers/User.controller.js'
import { check } from "express-validator";

import multer from '../middlewares/multer-config.js';

const router = Express.Router()

router.route('/register').post(UserController.register)
router.post('/login', UserController.login)
router.post("/send-confirmation-email", UserController.sendOTP)
router.post("/update", UserController.updateUser)

export default router