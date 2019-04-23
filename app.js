const { mongoUri, clientHost } = require('./environement')
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const conn = mongoose.connect( mongoUri, {useNewUrlParser: true} )

const PORT = process.env.PORT || 3000

const userRoutes = require('./routes/user')
const relationRoutes = require('./routes/relation')

app.use(bodyParser.json())

app.use('/user', userRoutes)
app.use('/relation', relationRoutes)

app.listen(3000)
