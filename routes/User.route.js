import Express from "express";

import * as UserController from '../Controllers/User.controller.js'
import { check} from "express-validator";

import multer from '../middlewares/multer-config.js';

const router = Express.Router()

router.route('/register')
    .post(multer,UserController.register)

export default router