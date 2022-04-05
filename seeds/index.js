const mongoose = require('mongoose')
const Activity = require('../models/activity')
const cities = require('./cities')
const { pre, activities } = require('./seedHelpers')
const { names } = require('./names')

mongoose.connect('mongodb://localhost:27017/activiti')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Database connected')
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Activity.deleteMany({})
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const activity = new Activity({
            title: `${sample(pre)}${sample(activities)} with ${sample(names)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`
        })
        await activity.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})