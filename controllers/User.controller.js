import User from '../Models/User.model.js';
import { validationResult } from 'express-validator';


export async function register(req, res) {
    let user = new User({
        fullName: req.body.fullName,
        userName: req.body.userName,
        mail: req.body.mail,
        image: `${req.protocol}://${req.get('host')}/media/${req.body.image}`,
        password: req.body.password,
        balance: req.body.balance,
        walletID: req.body.walletID,
        birthDate: req.body.birthDate
    })

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array()[0].msg
        })
    }

    const existUser = await User.findOne({ mail: req.body.mail })

    if (existUser) {
        return res.status(409).send("Address Already exist")
    }

    try {
        await user.save().then(user =>
            res.status(200).json({
                message: "User successfully created",
                user,
            })
        )
    } catch (err) {
        res.status(401).json({
            message: "User not successfully created",
            error: err.mesage,
            user,
        })
    }

}