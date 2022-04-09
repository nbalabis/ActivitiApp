const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Activity = require('./models/activity')
const Review = require('./models/review')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const { activitySchema, reviewSchema } = require('./schemas.js')
const { findByIdAndUpdate } = require('./models/activity')

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

const validateActivity = (req, res, next) => {
    const { error } = activitySchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/activities', catchAsync(async (req, res) => {
    const activities = await Activity.find({})
    res.render('activities/index', { activities })
}))

app.get('/activities/new', (req, res) => {
    res.render('activities/new')
})

app.post('/activities', validateActivity, catchAsync(async (req, res, next) => {
    const activity = new Activity(req.body.activity)
    await activity.save()
    res.redirect(`/activities/${activity._id}`)
}))

app.get('/activities/:id', catchAsync(async (req, res) => {
    const activity = await Activity.findById(req.params.id).populate('reviews')
    res.render('activities/show', { activity })
}))

app.get('/activities/:id/edit', catchAsync(async (req, res) => {
    const activity = await Activity.findById(req.params.id)
    res.render('activities/edit', { activity })
}))

app.put('/activities/:id', validateActivity, catchAsync(async (req, res) => {
    const activity = await Activity.findByIdAndUpdate(req.params.id, { ...req.body.activity })
    res.redirect(`/activities/${activity._id}`)
}))

app.delete('/activities/:id', catchAsync(async (req, res) => {
    const activity = await Activity.findByIdAndDelete(req.params.id)
    res.redirect('/activities')
}))

app.post('/activities/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const activity = await Activity.findById(req.params.id)
    const review = new Review(req.body.review)
    activity.reviews.push(review)
    await review.save()
    await activity.save()
    res.redirect(`/activities/${activity._id}`)
}))

app.delete('/activities/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Activity.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/activities/${id}`)
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = "Something went wrong!"
    res.status(statusCode).render('error', { err })
})

const port = 3000
app.listen(port, console.log(`Listening on port: ${port}`))