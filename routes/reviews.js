const express = require('express')
const catchAsync = require('../utils/catchAsync')
const Activity = require('../models/activity')
const Review = require('../models/review')
const reviews = require('../controllers/reviews')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const router = express.Router({mergeParams: true})

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.delete))

module.exports = router