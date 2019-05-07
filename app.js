const { mongoUri, clientHost } = require('./environement')
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const conn = mongoose.connect( mongoUri, {useNewUrlParser: true} )

const PORT = process.env.PORT || 3000

const userRoutes = require('./routes/user')
const relationRoutes = require('./routes/relation')
const postRoutes = require('./routes/post')
const postLikeRoutes = require('./routes/postLike')
const commentRoutes = require('./routes/comment')
const notificationRoutes = require('./routes/notification')
const messageRoutes = require('./routes/message')

app.use(bodyParser.json())

app.use('/user', userRoutes)
app.use('/relation', relationRoutes)
app.use('/post', postRoutes)
app.use('/post-like', postLikeRoutes)
app.use('/comment', commentRoutes)
app.use('/notification', notificationRoutes)
app.use('/message', messageRoutes)

app.listen(3000)
