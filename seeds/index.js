const mongoose = require('mongoose')
const Activity = require('../models/activity')
const cities = require('./cities')
const { categories } = require('./seedHelpers')
const { names } = require('./names')
const axios = require('axios')

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
        const category = sample(categories)
        const randomActivity = sample(category.activities)
        const activity = new Activity({
            title: `${randomActivity} with ${sample(names)}`,
            theme: category.theme,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            image: `https://source.unsplash.com/random/?${randomActivity}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Cursus sit amet dictum sit amet justo donec. Magna fringilla urna porttitor rhoncus dolor purus non enim. Parturient montes nascetur ridiculus mus. Ipsum dolor sit amet consectetur adipiscing elit pellentesque habitant. Quis hendrerit dolor magna eget est. Adipiscing bibendum est ultricies integer quis auctor elit. Neque convallis a cras semper. Non enim praesent elementum facilisis leo vel fringilla. Leo vel orci porta non. Sed id semper risus in hendrerit gravida rutrum. Mattis rhoncus urna neque viverra justo nec. Mauris ultrices eros in cursus turpis massa. A iaculis at erat pellentesque adipiscing. Volutpat maecenas volutpat blandit aliquam etiam erat velit scelerisque in.',
            price: Math.floor(Math.random() * 90) + 10
        })
        await activity.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})