const express = require('express')
const passport = require('passport')
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const router = express.Router()

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
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
}))

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/' }), (req, res) => {
    //FIXME: Can I 'redirect' to the current page AND keep the modal open/reopen modal?
    req.flash('success', 'Welcome back!')
    res.redirect('/activities')
})

module.exports = router