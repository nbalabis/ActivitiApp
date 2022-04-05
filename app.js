const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Activity = require('./models/activity')

const app = express()

mongoose.connect('mongodb://localhost:27017/activiti')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once ('open', () => {
    console.log('Database connected')
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/newactivity', async (req, res) => {
    const activity = new Activity({title: 'firstActivity', description: 'Just a test activity'})
    await activity.save()
    res.send(activity)
})

const port = 3000
app.listen(port, console.log(`Listening on port: ${port}`))