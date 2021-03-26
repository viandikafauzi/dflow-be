import express from 'express'
import {
  registerUser,
  activateUser,
  loginUser,
  forgotPassword,
  resetPasswordLink,
  resetPassword,
  getProfile,
} from '../controllers/userController.js'
import { jwtvalidate } from '../auth/validate.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/activate/*', activateUser)
router.post('/login', loginUser)
router.post('/forgot-password', forgotPassword)
router.get('/reset-password/*', resetPasswordLink)
router.post('/reset-password/*', resetPassword)
router.get('/profile', jwtvalidate, getProfile)

export default router
