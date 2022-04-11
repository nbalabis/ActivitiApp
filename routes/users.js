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
}))

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back!')
    const redirectUrl = req.session.returnTo || '/'
    delete req.session.returnTo
    res.redirect(redirectUrl)
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success', 'Goodbye!')
    res.redirect('/')
})

module.exports = router