import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import emailvalidator from 'email-validator'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import User from '../models/userModel.js'
import Token from '../models/tokenModel.js'
import Reset from '../models/resetModel.js'

// @desc    Register user
// @route   POST /api/v1/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!emailvalidator.validate(email)) {
    res.status(400)
    throw new Error('Email is invalid')
  }

  if (password.length < 8) {
    res.status(400)
    throw new Error('Password must have 8 characters or more')
  }

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, salt)

  const user = await User.create({
    email,
    password: hash,
  })

  const token = await Token.create({
    user: user._id,
    token: uuidv4(),
  })

  //////////////////////////
  // mail send start here //
  //////////////////////////

  const testAccount = await nodemailer.createTestAccount()

  const transport = nodemailer.createTransport({
    host: '127.0.0.1',
    port: 1025,
    ignoreTLS: true,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  })

  const info = await transport.sendMail({
    from: 'Admin <admin@example.com>',
    to: user.email,
    subject: 'Account activation',
    text: 'Open in browser to activate account',
    html: `<p>Click button below to activate account</p><br><button><a href='http://${process.env.FE_URL}/active/${token.token}'>Activate here</a></button>`,
  })

  //////////////////////////
  //      mail end        //
  //////////////////////////

  if (user && token) {
    res.status(201).json({
      _id: user._id,
      email: user.email,
      token: token.token,
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Activate user
// @route   POST /api/v1/register
// @access  Public
const activateUser = asyncHandler(async (req, res) => {
  const temp = req.params
  const token = temp[0]

  const findtoken = await Token.findOne({
    token,
  })

  if (!findtoken) {
    res.status(404)
    throw new Error('Token is not valid')
  }

  await User.findOneAndUpdate(
    {
      _id: findtoken.user,
    },
    {
      isVerified: true,
    }
  )

  await findtoken.delete()

  res.status(201).json({ message: 'User is activated' })
})

// @desc    Login user
// @route   POST /api/v1/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    res.status(400)
    throw new Error('Username or password invalid')
  }

  const checkpassword = await bcrypt.compare(password, user.password)

  if (user && checkpassword) {
    const JWTtoken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '10d',
    })

    res.json({
      _id: user._id,
      email: user.email,
      JWTtoken,
    })
  } else {
    res.status(400)
    throw new Error('Username or password invalid')
  }
})

// @desc    Forgot password
// @route   POST /api/v1/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    res.status(400)
    throw new Error('Wrong email entered')
  }

  const reset = await Reset.create({
    user: user._id,
    reset: uuidv4(),
  })

  if (reset) {
    res.status(201).json({
      _id: user._id,
      email: user.email,
      reset,
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Reset password
// @route   GET /api/v1/reset-password
// @access  Public
const resetPasswordLink = asyncHandler(async (req, res) => {
  const temp = req.params
  const reset = temp[0]

  const findResetToken = await Reset.findOne({
    reset,
  })

  if (!findResetToken) {
    res.status(404)
    throw new Error('Link is not valid')
  }

  const user = await User.findOne({
    _id: findResetToken.user,
  })

  res.status(200).json({
    _id: user._id,
    email: user.email,
  })
})

// @desc    Reset password
// @route   POST /api/v1/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const temp = req.params
  const reset = temp[0]

  const findResetToken = await Reset.findOne({
    reset,
  })

  if (!findResetToken) {
    res.status(404)
    throw new Error('Link is not valid')
  }

  const { password } = req.body

  if (password.length < 8) {
    res.status(400)
    throw new Error('Password must have 8 characters or more')
  }

  const user = await User.findOne({ _id: findResetToken.user })

  if (!user) {
    res.status(501)
    throw new Error('User not found')
  }

  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, salt)

  user.password = hash

  await user.save()
  await findResetToken.delete()

  res.json({ message: 'Password updated' })
})

// @desc    Reset password
// @route   GET /api/v1/reset-password
// @access  Public
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      email: user.email,
      password: user.password,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

export {
  registerUser,
  activateUser,
  loginUser,
  forgotPassword,
  resetPasswordLink,
  resetPassword,
  getProfile,
}
