const User = require('../models/user')

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, e => {
            if (e) return next(err)
        })
        req.flash('success', 'Welcome to Activiti!')
        res.redirect('/activities')
    } catch (e) {
        let message = e.message
        if (message.includes('email_1 dup key')) {
            message = 'A user with that email is already registered'
        }
        req.flash('error', message)
        res.redirect('/register')
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!')
    const redirectUrl = req.session.returnTo || '/'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logout()
    req.flash('success', 'Goodbye!')
    res.redirect('/')
}

module.exports.viewHost = async (req, res) => {
    const host = await User.findById(req.params.id)
    if (!host) {
        req.flash('error', 'Sorry, we couldn\'t find that user!')
        return res.redirect('/activities')
    }
    res.render('users/host', { host })
}