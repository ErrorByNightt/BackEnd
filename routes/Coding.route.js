import Express from "express";

import * as aiController from '../controllers/Coding.controller.js'

const router = Express.Router()

router.route('/testCode')
    .get(aiController.getProblem)
router.route('/saveCode')
    .post(aiController.saveProblem)
router.route('/genProb')
    .get(aiController.generateProb)
router.route('/codeProb')
    .post(aiController.codeProblem)
    


export default router