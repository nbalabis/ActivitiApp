const express = require('express')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Activity = require('../models/activity')
const Review = require('../models/review')
const { reviewSchema } = require('../schemas.js')
const router = express.Router({mergeParams: true})

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const activity = await Activity.findById(req.params.id)
    const review = new Review(req.body.review)
    activity.reviews.push(review)
    await review.save()
    await activity.save()
    req.flash('success', 'Thanks for leaving a review!')
    res.redirect(`/activities/${activity._id}`)
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Activity.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/activities/${id}`)
}))

module.exports = router