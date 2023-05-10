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
  const { mail, password, userName, city, job, school } = req.body
  const existUser = await User.findOne({ mail: req.body.mail })
  if (existUser) {
    return res.status(409).send("User Already exist")
  }
  const user = new User({
   
    userName,
    //image: `${req.protocol}://${req.get('host')}/media/profile/${req.body.image}`,
    mail,
    password,
    city,
    job,
    school,
    
    otp: parseInt(Math.random() * 10000),
    isVerified: false
  });

  user
    .save()
    .then(user => {
      //sendOTP(user.mail)
      res.status(200).send(user)
    })
    .catch(err => {
      res.json({
        error: err
      })
    })
}






export async function getAllUsers (req, res)  {
  try {
    await User.find({}).then((result) => {
      console.log(result);
      return res.send(result);
    });
  } catch (err) {
      console.log(err);
  }
};







//update image
export async function updateImage(req, res) {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { 
        image: `http://localhost:5000/uploads/${req.file.filename}`
      },
      { new: true } // return the updated user object
    );

    // save the updated user object
    await user.save();

    res.json({ message: "Image uploaded successfully", imageUrl: `http://localhost:5000/uploads/${req.file.filename}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}


//Login
/*export async function login(req, res) {
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
}*/





export async function login(req, res) {
  const { mail, password } = req.body
  if (!(mail && password)) {
    res.status(400).send('Input required')
  }

  const user = await User.findOne({ mail, password })
  if (user) {
    if (user.etat === 'banned') {
      // Si l'utilisateur est banni, on vérifie si la durée de bannissement est écoulée ou non
      const banDuration = 1 // Durée de bannissement en minutes
      const banDate = user.dateBanned
      const currentDate = Date.now()

      if (banDate && (currentDate - banDate) < (banDuration * 60 * 1000)) {
        // Si la durée de bannissement n'est pas encore écoulée, on renvoie un message d'erreur
        return res.status(403).send({ message: `User banned for 1 minutes` })
      } else {
        // Si la durée de bannissement est écoulée, on active le compte de l'utilisateur
        user.etat = 'active'
        user.dateBanned = null
        await user.save()
      }
    }

    if (user.etat === 'deactivated') {
      return res.status(403).send({ message: 'Account deactivated' })
    }

    if (!user.verified) {
      return res.status(403).send({ user, message: 'Mail not verified' })
    } else {
      return res.status(200).send({ user, message: 'Success' })
    }
  } else {
    return res.status(403).send({ message: 'Wrong username or password' })
  }
}






export async function changeUserState(req, res) {
  const { id } = req.params
  const { etat } = req.body

  if (!(id && etat)) {
    res.status(400).send('Input required')
  }

  const user = await User.findById(id)
  if (!user) {
    return res.status(404).send('User not found')
  }

  switch (etat) {
    case 'banned':
      user.etat = 'banned'
      user.dateBanned = Date.now()
      await user.save()
      return res.status(200).send({ message: 'User banned successfully' })
     
    case 'deactivated':
      user.etat = 'deactivated'
      user.dateBanned = null
      await user.save()
      return res.status(200).send({ message: 'User deactivated successfully' })

    case 'active':
      user.etat = 'active'
      user.dateBanned = null
      await user.save()
      return res.status(200).send({ message: 'User activated successfully' })

    default:
      return res.status(200).send({ message: 'Invalid state' })

  }
}







//get user by id
export async function getUserById(req, res) {
  console.log(req.params.id);
        User.findById(req.params.id)
        .then(result=>{
          return res.status(200).json({
                user:result
            })
        })
        .catch(err=> {
            console.log(err);
            return res.status(500).json({
                error:err
            })
        })
}


//Update user 
export async function updateUser(req, res) {
  const {password, mail, pseudo, city, job, school } = req.body
  var user = await User.findOneAndUpdate(req.params.id,

    {
      $set: {
       
       mail: mail,
        pseudo: pseudo,
        city: city,
        job: job,
        school: school,
        password: password
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
  var email = req.body.email
  const user = await User.findOne({ mail: email })
  console.log(user)
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