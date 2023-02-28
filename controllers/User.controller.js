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
  const emailValid = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  try {
    const { fullname, email, password, userName, balance, birthDate, friends, achievements, badges, courses, gamesPlayed } = req.body

    console.log(fullname, email)

    if (!(
      fullname &&
      email &&
      password &&
      birthDate
    )) {
      //res.status(400).send('Required Inputs')
      console.log("inputs required")
      return res.status(400).send({ message: 'Required Inputs' })
    }

    if (emailValid.test(email) == false) {
      console.log("email invalid")
      return res.status(400).send({ message: 'email invalid' })
      //res.status(400).send('email invalid')
      //return
    }

    //checking the existance of user
    if (await User.findOne({ email })) {
      return res.status(403).send({ message: "User already exist !" })
    } else {

      let user = await new User({
        fullname,
        userName,
        image: `${req.protocol}://${req.get('host')}/media/profile/${req.body.image}`,
        email,
        password: await bcrypt.hash(password, 10),
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
        isVerified: true
      })
      user.save()
        .then(user => {
          sendEmailtest(user.email, user.otp)
          return res.json({
            message: 'User added successfully!'
          })
        })
        .catch(error => {
          return res.json({
            message: 'An error occured!'
          })
        })
    }//res.send(user)
  } catch (err) {
    console.log(err)
    return res.send(err)
  }
}


//Login
export async function login(req, res) {
  const { email, password } = req.body
  console.log("email", email)
  if (!(email && password)) {
    res.status(400).send('Required Input')
  }

  const user = await User.findOne({ email })


  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateUserToken(user)
    console.log("token = ", token)

    if (!user.isVerified) {
      return res.status(403).send({ user, message: "email non verifié" })
    } else {
      dotenv.config()

      return res.status(200).send({ token, user, message: "success" })
    }
  } else {
    return res.status(403).send({ message: "mot de passe ou email incorrect" })
  }
}




//Update pwd 
export async function updatePassword(req, res) {
  const { email, newPassword } = req.body

  if (newPassword) {
    newPasswordEncrypted = await bcrypt.hash(newPassword, 10)

    let user = await user.findOneAndUpdate(
      { email: email },
      {
        $set: {
          password: newPasswordEncrypted,
        },
      }
    )

    return res.send({ message: "Password updated successfully", user })
  } else {
    return res.status(403).send({ message: "Password should not be empty" })
  }
}



// Send OTP
export async function sendOTP(email) {
  const user = await User.findOne({ email: email })
  sendEmailOTP({
    from: process.env.ninja_mail,
    to: email,
    subject: "Password reset",
    template: 'otp',
    context: {
      OTP: user.otp
    }
  })
}

//Send Confirmation email
export async function sendEmail(mailOptions) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ninja_mail,
      pass: process.env.ninja_password,
    },
  })
  const handlebarOptions = {
    viewEngine: {
      extName: ".html",
      partialsDir: path.resolve('./views'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./views'),
    extName: ".html",
  }
  transporter.use('compile', hbs(handlebarOptions))

  transporter.verify(function (error, success) {
    if (error) {
      console.log(error)
      console.log('Server not ready')
    } else {
      console.log('Server is ready to take our messages')
    }
  })

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

export async function confirmation(req, res) {
  if (req.params.token) {
    try {
      let token = jwt.verify(req.params.token, process.env.ACCESS_TOKEN_SECRET)
      console.log(token.user._id);
    } catch (err) {
      return res.status(200).json({ "error": "erreur" })
    }
  } else {
    return res.status(200).json({ "error": "erreur" })
  }
  let token = jwt.verify(req.params.token, process.env.ACCESS_TOKEN_SECRET)
  console.log(token);
  User.findById(token.user._id, function (err, user) {
    if (!user) {
      return res.status(200).json({ "error": "user does Not Exist" })
    } else if (user.verified) {
      return res.status(200).json({ "error": "user alerady verified" })
    } else {
      user.verified = true
      user.save(function (err) {
        if (err) {
          return res.status(400).json({ "error": "erreur" })
        } else {
          return res.status(200).json({ "success": "user verified" })
        }
      })
    }
  })
}


// RESET PWD 
export async function resetPassword(req,res) {
  const email = req.body.email
  const newPass = req.body.newPass
  console.log("newPass = ",newPass)
  const otp = req.body.otp
  const user = await User.findOne({ email: email ,otp: otp })
    if (user) {
        user.password = await bcrypt.hash(newPass, 10)
        user.save().then(() => {
          res.status(200).json({"message": "user password changed"})
        }).catch(() => {
          res.status(400).json({"error": "error"})
        })
    } else {
      res.status(400).json({"error": "error"})
    }
}

// FORGOT PWD

export async function forgotPassword (req, res) {
  let OTP = otpGenerator.generate(4,{upperCaseAlphabets:false,specialChars:false,digits:true,lowerCaseAlphabets:false})
  const user = await User.findOneAndUpdate({ email: req.body.email},{otp: OTP})
  if (user) {
    sendEmailtest(req.body.email, OTP)
    res.status(200).send({
      message: "L'email de reinitialisation a été envoyé a " + user.email,
    })
  } else {
    res.status(404).send({ message: "User innexistant" })
  }
}
async function sendOTP(email) {
  const user = await User.findOne({ email: email })
  sendEmailOTP({
    from: process.env.savy_mail,
    to: email,
    subject: "Password reset",
    template: 'otp',
    context: {
      OTP : user.otp
    }
  })
}

/////////////////// FOR ADMIN

//Show the list of Users

export function index(req, res, next) {
  User.find()
    .then(response => {
      res.json({
        response
      })
    })
    .catch(error => {
      res.json({
        message: 'An error occured. '
      })
    })
}

// Show single user
export function show(req, res, next) {
  let userID = req.body._id
  User.findById(userID)
    .then(response => {
      res.json({
        response
      })
    })
    .catch(error => {
      res.json()
      message: 'An error occured'
    })

}

// Delete a user

export async function deletee(req, res) {
  let user = await User.findById(req.body._id)
  if (user) {
    await user.remove()
    return res.send({ message: "User" + user._id + " has been deleted" })
  } else {
    return res.status(404).send({ message: "User does not exist" })
  }
}