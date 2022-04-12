const Activity = require('../models/activity')

module.exports.index = async (req, res) => {
    const activities = await Activity.find({}).populate('host', 'firstName')
    res.render('activities/index', { activities })
}

module.exports.renderNewForm = (req, res) => {
    res.render('activities/new')
}

module.exports.createActivity = async (req, res, next) => {
    const activity = new Activity(req.body.activity)
    activity.host = req.user._id
    await activity.save()
    res.redirect(`/activities/${activity._id}`)
}

module.exports.show = async (req, res) => {
    const activity = await Activity.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('host')
    if (!activity) {
        req.flash('error', 'Sorry, we couldn\'t find that activity!')
        return res.redirect('/activities')
    }
    res.render('activities/show', { activity })
}

module.exports.renderEditForm = async (req, res) => {
    const activity = await Activity.findById(req.params.id)
    if (!activity) {
        req.flash('error', 'Sorry, we couldn\'t find that activity!')
        return res.redirect('/activities')
    }
    res.render('activities/edit', { activity })
}

module.exports.edit = async (req, res) => {
    const activity = await Activity.findByIdAndUpdate(req.params.id, { ...req.body.activity })
    res.redirect(`/activities/${activity._id}`)
}

module.exports.delete = async (req, res) => {
    const activity = await Activity.findByIdAndDelete(req.params.id)
    if (!activity) {
        req.flash('error', 'Sorry, we couldn\'t find that activity!')
        return res.redirect('/activities')
    }
    req.flash('success', 'Activity successfully deleted.')
    res.redirect('/activities')
}