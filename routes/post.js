const express = require('express')
const router = express.Router()
const relationFollow = require('./../middlewares/relationFollow')
const postCreationPhoto = require('./../middlewares/postCreationPhoto')
const postDeletion = require('./../middlewares/postDeletion')
const postCreationInfo = require('./../middlewares/postCreationInfo')
const postDisplay = require('./../middlewares/postDisplay')
const postFeedUser = require('./../middlewares/postFeedUser')
// const postUser = require('./../middlewares/postUser')

router.get('/:publicId', postDisplay)
router.delete('/:publicId', postDeletion)
router.post('/info', postCreationInfo)
router.post('/photo/:mode', postCreationPhoto)
router.get('/user/feed/:page', postFeedUser)


module.exports = router