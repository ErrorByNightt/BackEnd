import Express from "express";

import * as aiController from '../Controllers/Ai.controller.js'

const router = Express.Router()

router.route('/testQCM')
    .get(aiController.getQCM)
router.route('/saveQCM')
    .post(aiController.saveUCQ)
router.route('/genQCM')
    .get(aiController.generateUCQ)
router.route('/solveQCM')
    .post(aiController.solveUCQ)
router.route('/getHINT')
    .post(aiController.getHINT)

export default router