const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Activity = require('./models/activity')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')

const app = express()

mongoose.connect('mongodb://localhost:27017/activiti')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Database connected')
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/activities', async (req, res) => {
    const activities = await Activity.find({})
    res.render('activities/index', { activities })
})

app.get('/activities/new', (req, res) => {
    res.render('activities/new')
})

app.post('/activities', async (req, res) => {
    const activity = new Activity(req.body.activity)
    await activity.save()
    res.redirect(`/activities/${activity._id}`)
})

app.get('/activities/:id', async (req, res) => {
    const activity = await Activity.findById(req.params.id)
    res.render('activities/show', { activity })
})

app.get('/activities/:id/edit', async (req, res) => {
    const activity = await Activity.findById(req.params.id)
    res.render('activities/edit', { activity })
})

app.put('/activities/:id', async (req, res) => {
    const activity = await Activity.findByIdAndUpdate(req.params.id, { ...req.body.activity })
    res.redirect(`/activities/${activity._id}`)
})

app.delete('/activities/:id', async(req, res) => {
    const activity = await Activity.findByIdAndDelete(req.params.id)
    res.redirect('/activities')
})

const port = 3000
app.listen(port, console.log(`Listening on port: ${port}`))