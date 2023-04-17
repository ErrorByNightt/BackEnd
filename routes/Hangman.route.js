import Express from "express";

import * as hangmanController from '../Controllers/Hangman.controller.js'

const router = Express.Router()

router.route('/add')
    .post(hangmanController.AddWords)
router.route('/')
    .post(hangmanController.getAll)


export default router