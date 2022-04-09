const express = require('express')
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

router.get('/:id', catchAsync(async (req, res) => {
    const activity = await Activity.findById(req.params.id).populate('reviews')
    res.render('activities/show', { activity })
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const activity = await Activity.findById(req.params.id)
    res.render('activities/edit', { activity })
}))

router.put('/:id', validateActivity, catchAsync(async (req, res) => {
    const activity = await Activity.findByIdAndUpdate(req.params.id, { ...req.body.activity })
    res.redirect(`/activities/${activity._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
    await Activity.findByIdAndDelete(req.params.id)
    res.redirect('/activities')
}))

module.exports = router