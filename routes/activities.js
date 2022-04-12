const express = require('express')
const catchAsync = require('../utils/catchAsync')
const Activity = require('../models/activity')
const activities = require('../controllers/activities')
const { validateActivity, validateId, isLoggedIn, isHost } = require('../middleware')
const router = express.Router()

router.get('/', catchAsync(activities.index))

router.get('/new', isLoggedIn, activities.renderNewForm)

router.post('/', isLoggedIn, validateActivity, catchAsync(activities.createActivity))

router.get('/:id', validateId, catchAsync(activities.show))

router.get('/:id/edit', isLoggedIn, isHost, validateId, catchAsync(activities.renderEditForm))

router.put('/:id', isLoggedIn, isHost, validateActivity, catchAsync(activities.edit))

router.delete('/:id', isLoggedIn, isHost, validateId, catchAsync(activities.delete))

module.exports = router