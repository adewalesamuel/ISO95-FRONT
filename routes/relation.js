const express = require('express')
const router = express.Router()
const relationFollow = require('./../middlewares/relationFollow')
const relationUnfollow = require('./../middlewares/relationUnfollow')
const relationFollower = require('./../middlewares/relationFollower')
const relationFollowing = require('./../middlewares/relationFollowing')

router.post('/follow', relationFollow)
router.delete('/unfollow', relationUnfollow)
router.get('/:username/followers', relationFollower)
router.get('/:username/followings', relationFollowing)

module.exports = router