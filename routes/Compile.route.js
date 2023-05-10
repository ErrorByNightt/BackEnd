import Express from "express";

import * as CompileCode from '../controllers/Compile.controller.js'

const router = Express.Router()

router.route('/CompileCode')
    .post(CompileCode.CompileCode)

export default router