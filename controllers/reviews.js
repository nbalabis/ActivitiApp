const Activity = require('../models/activity')
const Review = require('../models/review')

module.exports.createReview = async (req, res) => {
    const activity = await Activity.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    activity.reviews.push(review)
    await review.save()
    await activity.save()
    req.flash('success', 'Thanks for leaving a review!')
    res.redirect(`/activities/${activity._id}`)
}

module.exports.delete = async (req, res) => {
    const { id, reviewId } = req.params
    await Activity.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/activities/${id}`)
}