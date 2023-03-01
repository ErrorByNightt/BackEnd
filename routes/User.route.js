import Express from "express";

import * as UserController from '../Controllers/User.controller.js'
import { check } from "express-validator";

import multer from '../middlewares/multer-config.js';

const router = Express.Router()

router.route('/register')
    .post(UserController.register)
router.get('/', UserController.index)
router.post('/login', UserController.login)
router.route("/register").post(UserController.register)
router.delete('/delete/{_id}', UserController.deletee)
router.post("/send-confirmation-email", UserController.sendOTP)
router.get("/confirmation/:token", UserController.confirmation)
router.post('/forgotPassword', UserController.forgotPassword)
router.post("/resetPassword", UserController.resetPassword)

export default router