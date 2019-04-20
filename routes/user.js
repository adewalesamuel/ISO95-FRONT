const express = require('express')
const router = express.Router()
const userRegistration = require('./../middlewares/userRegistration')
const userLogin = require('./../middlewares/userLogin')
const userPasswordTokenGeneration = require('./../middlewares/userPasswordTokenGeneration')

router.post('/register', userRegistration)
router.post('/login', userLogin)
router.post('/forgot-password', userPasswordTokenGeneration)


module.exports = router