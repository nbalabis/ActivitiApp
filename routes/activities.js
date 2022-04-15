const express = require('express')
const multer = require('multer')
const catchAsync = require('../utils/catchAsync')
const activities = require('../controllers/activities')
const { validateActivity, validateId, isLoggedIn, isHost } = require('../middleware')
const { storage } = require('../cloudinary')
const router = express.Router()
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(activities.index))
    .post(isLoggedIn, upload.array('images'), validateActivity, catchAsync(activities.create))
    //FIXME: re-work to validate before uploading to cloudinary

router.get('/new', isLoggedIn, activities.renderNewForm)

router.route('/:id')
    .get(validateId, catchAsync(activities.show))
    .put(isLoggedIn, isHost, upload.array('images'), validateActivity, catchAsync(activities.edit))
    .delete(isLoggedIn, isHost, validateId, catchAsync(activities.delete))

router.get('/:id/edit', isLoggedIn, isHost, validateId, catchAsync(activities.renderEditForm))

module.exports = router