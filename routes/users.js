const express = require('express')
const User = ('../models/user')
const catchAsync = require('../utils/catchAsync')
const router = express.Router()

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res, next) => {
    res.send(req.body)
}))

module.exports = router