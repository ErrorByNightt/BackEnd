import Express from "express";

import * as UserController from '../Controllers/User.controller.js'
import { check } from "express-validator";

import multer from '../middlewares/multer-config.js';

const router = Express.Router()

router.route('/register')
    .post(
        [
            check("mail", "Email should be valid").isEmail(),
            check("userName", "username at least should be 3 charac").isLength({ min: 3 }),
            check("password", "Password at least should be 5 charac").isLength({ min: 5 })
        ],
        multer,
        UserController.register)

router.route('/login')
    .post(
        UserController.login)

router.route('/verifUser')
    .post(
        UserController.verifUser)

export default router