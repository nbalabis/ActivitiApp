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

const activites = require('./routes/activities')

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

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

app.use('/activities', activites)

app.get('/', (req, res) => {
    res.render('home')
})

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