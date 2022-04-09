const express = require('express')
const ObjectID = require('mongoose').Types.ObjectId
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Activity = require('../models/activity')
const { activitySchema } = require('../schemas.js')
const router = express.Router()

const validateActivity = (req, res, next) => {
    const { error } = activitySchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

const validateId = (req, res, next) => {
    if(!ObjectID.isValid(req.params.id)) {
        req.flash('error', 'Sorry, we couldn\'t find that activity!')
        return res.redirect('/activities')
    }
    next()
}

router.get('/', catchAsync(async (req, res) => {
    const activities = await Activity.find({})
    res.render('activities/index', { activities })
}))

router.get('/new', (req, res) => {
    res.render('activities/new')
})

router.post('/', validateActivity, catchAsync(async (req, res, next) => {
    const activity = new Activity(req.body.activity)
    await activity.save()
    res.redirect(`/activities/${activity._id}`)
}))

router.get('/:id', validateId, catchAsync(async (req, res) => {
    const activity = await Activity.findById(req.params.id).populate('reviews')
    if (!activity) {
        req.flash('error', 'Sorry, we couldn\'t find that activity!')
        return res.redirect('/activities')
    }
    res.render('activities/show', { activity })
}))

router.get('/:id/edit', validateId, catchAsync(async (req, res) => {
    const activity = await Activity.findById(req.params.id)
    if (!activity) {
        req.flash('error', 'Sorry, we couldn\'t find that activity!')
        return res.redirect('/activities')
    }
    res.render('activities/edit', { activity })
}))

router.put('/:id', validateActivity, catchAsync(async (req, res) => {
    const activity = await Activity.findByIdAndUpdate(req.params.id, { ...req.body.activity })
    res.redirect(`/activities/${activity._id}`)
}))

router.delete('/:id', validateId, catchAsync(async (req, res) => {
    const activity = await Activity.findByIdAndDelete(req.params.id)
    if (!activity) {
        req.flash('error', 'Sorry, we couldn\'t find that activity!')
        return res.redirect('/activities')
    }
    req.flash('success', 'Activity successfully deleted.')
    res.redirect('/activities')
}))

module.exports = router