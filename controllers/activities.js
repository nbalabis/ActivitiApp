const Activity = require('../models/activity')
const { cloudinary } = require('../cloudinary')

module.exports.index = async (req, res) => {
    const activities = await Activity.find({}).populate('host', 'firstName').populate('reviews')
    res.render('activities/index', { activities })
}

module.exports.renderNewForm = (req, res) => {
    res.render('activities/new')
}

module.exports.create = async (req, res, next) => {
    const activity = new Activity(req.body.activity)
    activity.host = req.user._id
    activity.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
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
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    activity.images.push(...images)
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await activity.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    await activity.save()
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