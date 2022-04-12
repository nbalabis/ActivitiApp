const express = require('express')
const catchAsync = require('../utils/catchAsync')
const activities = require('../controllers/activities')
const { validateActivity, validateId, isLoggedIn, isHost } = require('../middleware')
const router = express.Router()

router.route('/')
    .get(catchAsync(activities.index))
    .post(isLoggedIn, validateActivity, catchAsync(activities.create))

router.get('/new', isLoggedIn, activities.renderNewForm)

router.route('/:id')
    .get(validateId, catchAsync(activities.show))
    .put(isLoggedIn, isHost, validateActivity, catchAsync(activities.edit))
    .delete(isLoggedIn, isHost, validateId, catchAsync(activities.delete))

router.get('/:id/edit', isLoggedIn, isHost, validateId, catchAsync(activities.renderEditForm))

module.exports = router