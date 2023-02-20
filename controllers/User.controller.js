import User from '../Models/User.model.js';
import { validationResult } from 'express-validator';
import nodemailer from 'nodemailer';

// function to 4 digit generate OTP
function generateOTP() {

    // Declare a digits variable  
    // which stores all digits 
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

function sendMail(mail, user) {
    var email;

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        service: 'Gmail',

        auth: {
            user: "mohameddhiabenamar@gmail.com",
            pass: "gzhtclhwtaznnbts",
        }

    });

    var mailOptions = {
        from: 'mohameddhiabenamar@gmail.com',
        to: mail,
        subject: 'Verify your account',
        text: "Otp : " + user.otp
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

export async function register(req, res) {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array()[0].msg
        })
    }

    let user = new User({
        fullName: req.body.fullName,
        userName: req.body.userName,
        mail: req.body.mail,
        image: `${req.protocol}://${req.get('host')}/media/${req.body.image}`,
        password: req.body.password,
        balance: req.body.balance,
        walletID: req.body.walletID,
        birthDate: req.body.birthDate,
        verified: false,
        otp: generateOTP()
    })

    const existUser = await User.findOne({ mail: req.body.mail })

    if (existUser) {
        return res.status(409).send("Address Already exist")
    }

    try {
        await user.save().then(user =>
            res.status(200).json({
                message: "User successfully created",
                user,
            }),
            sendMail(user.mail, user)
        )
    } catch (err) {
        res.status(401).json({
            message: "User not successfully created",
            error: err.mesage,
            user,
        })
    }

}

export async function login(req, res) {
    var password = req.body.password;
    var username = req.body.username;

    User.findOne({ $and: [{ username: username }, { password: password }, { verified: true }] })
        .then(user => {
            if (user) {
                res.status(200).json({
                    message: 'Login Successful'
                })
            } else {
                res.status(401).json({
                    message: 'User not found or not verified'
                })
            }
        })
}

export async function verifUser(req, res) {
    const existUser = await User.findOne({ mail: req.body.mail })

    if (existUser.otp == req.body.otp) {

        User.updateOne({ mail: req.body.mail }, {
            $set: {
                verified: true
            },
        }, { upsert: true }).then(
            res.status(200).json({
                message: 'User is now verified'
            }))
    }
}