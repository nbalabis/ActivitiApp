const ObjectID = require('mongoose').Types.ObjectId
const ExpressError = require('./utils/ExpressError')
const Activity = require('./models/activity')
const { activitySchema } = require('./schemas.js')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!')
        return res.redirect('/login')
    }
    next()
}

module.exports.validateActivity = (req, res, next) => {
    const { error } = activitySchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.validateId = (req, res, next) => {
    if (!ObjectID.isValid(req.params.id)) {
        req.flash('error', 'Sorry, we couldn\'t find that activity!')
        return res.redirect('/activities')
    }
    next()
}

module.exports.isHost = async (req, res, next) => {
    const { id } = req.params
    const activity = await Activity.findById(id)
    if (!activity.host.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/activities/${id}`)
    }
    next()
}