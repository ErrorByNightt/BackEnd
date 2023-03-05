import User from '../Models/User.model.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import otpGenerator from 'otp-generator'
import hbs from 'nodemailer-express-handlebars'
import * as dotenv from 'dotenv'

//Add User
export async function register(req, res, next) {
  const { fullName, mail, password, userName, balance, birthDate, friends, achievements, badges, courses, gamesPlayed } = req.body
  const existUser = await User.findOne({ mail: req.body.mail })
  if (existUser) {
    return res.status(409).send("User Already exist")
  }
  let user = new User({
    fullName,
    userName,
    //image: `${req.protocol}://${req.get('host')}/media/profile/${req.body.image}`,
    mail,
    password,
    birthDate,
    balance,
    friends,
    rank: "Unranked",
    etat: "active",
    friends,
    achievements,
    badges,
    courses,
    gamesPlayed,
    otp: parseInt(Math.random() * 10000),
    isVerified: false
  })

  user
    .save()
    .then(user => {
      sendOTP(user.mail)
      res.status(200).json(user)
    })
    .catch(err => {
      res.json({
        error: err
      })
    })
}


//Login
export async function login(req, res) {
  const { mail, password } = req.body
  if (!(mail && password)) {
    res.status(400).send('Required Input')
  }

  const user = await User.findOne({ mail, password })
  if (user) {
    if (!user.verified) {
      return res.status(403).send({ user, message: "Mail Non Verified" })
    } else {
      return res.status(200).send({ user, message: "Success" })
    }
  } else {
    return res.status(403).send({ message: "Wrong username or password" })
  }
}

//Update user 
export async function updateUser(req, res) {
  const { mail, pseudo, city, job, school } = req.body
  let user = await user.findOneAndUpdate(
    { mail },
    {
      $set: {
        image: `${req.protocol}://${req.get('host')}/media/profile/${req.body.image}`,
        pseudo: pseudo,
        city: city,
        job: job,
        school: school
      },
    },
    {
      returnDocument: 'after'
    }
  )
  return res.send({ message: "User updated successfully", user })
}

// Send OTP
export async function sendOTP(req, res) {
  var email = req.body.mail
  const user = await User.findOne({ mail: email })
  let transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mohameddhiabenamar@gmail.com",
      pass: "vdgtzxjehksifknu",
    },
  })
  const mailOptions = {
    from: 'mohameddhiabenamar@gmail', // Sender address
    to: email, // List of recipients
    subject: "Password reset",
    template: 'otp',// Plain text body
    text: user.otp.toString()
  };
  transport.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
  });
}