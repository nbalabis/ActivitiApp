if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const mongoose = require('mongoose')
const Activity = require('../models/activity')
const User = require('../models/user')
const Review = require('../models/review')
const cities = require('./cities')
const { categories } = require('./seedHelpers')
const { names } = require('./names')
const { cloudinary } = require('../cloudinary')

mongoose.connect('mongodb://localhost:27017/activiti')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Database connected')
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const getRandomUser = async () => {
    const userCount = await User.estimatedDocumentCount()
    const randomUserNumber = Math.floor(Math.random() * userCount)
    const randomUser = await User.findOne().skip(randomUserNumber)
    return randomUser
}

const uploadImage = async (activity) => {
    let imgUrl = ''
    await cloudinary.uploader.upload(`https://source.unsplash.com/random/?${activity}`, { folder: 'activiti' },
        function (error, result) {
            if (error) console.log(error)
            imgUrl = result.url
        }
    )
    return imgUrl
}

const seedUsers = async () => {
    await User.deleteMany({})
    const admin = new User({
        username: 'admin',
        firstName: 'Admin',
        email: 'admin@fakemail.com',
        isAdmin: true
    })
    await User.register(admin, 'admin')

    for (let i = 0; i < 5; i++) {
        try {
            const firstName = sample(names)
            const username = firstName + Math.floor(Math.random() * 1000)
            const user = new User({
                username,
                firstName,
                email: `${username}@fakemail.com`
            })
            const password = 'password'
            await User.register(user, password)
        } catch (e) {
            console.log(e)
        }
    }
}

const seedActivities = async () => {
    await Activity.deleteMany({})
    for (let i = 0; i < 20; i++) {
        const randomUser = await getRandomUser()
        const random1000 = Math.floor(Math.random() * 1000)
        const category = sample(categories)
        const randomActivity = sample(category.activities)
        const imgUrl = await uploadImage(randomActivity)
        const activity = new Activity({
            title: `${randomActivity}`,
            host: randomUser._id,
            theme: category.theme,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            images: [
                {
                    url: imgUrl,
                    filename: 'randomImg'
                }
            ],
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Cursus sit amet dictum sit amet justo donec. Magna fringilla urna porttitor rhoncus dolor purus non enim. Parturient montes nascetur ridiculus mus. Ipsum dolor sit amet consectetur adipiscing elit pellentesque habitant. Quis hendrerit dolor magna eget est. Adipiscing bibendum est ultricies integer quis auctor elit. Neque convallis a cras semper. Non enim praesent elementum facilisis leo vel fringilla. Leo vel orci porta non. Sed id semper risus in hendrerit gravida rutrum. Mattis rhoncus urna neque viverra justo nec. Mauris ultrices eros in cursus turpis massa. A iaculis at erat pellentesque adipiscing. Volutpat maecenas volutpat blandit aliquam etiam erat velit scelerisque in.',
            price: Math.floor(Math.random() * 90) + 10
        })
        await activity.save()
    }
}

const seedReviews = async () => {
    const allActivities = await Activity.find()
    for (let activity of allActivities) {
        const randomReviews = Math.floor(Math.random() * 6) + 1
        for (let i = 0; i < randomReviews; i++) {
            const randomUser = await getRandomUser()
            const review = new Review({
                body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Cursus sit amet dictum sit amet justo donec.',
                rating: Math.floor(Math.random() * 5) + 1,
                author: randomUser._id
            })
            activity.reviews.push(review)
            await review.save()
            await activity.save()
        }
    }
}

const seedDB = async () => {
    await seedUsers()
    await seedActivities()
    await seedReviews()
}

seedDB().then(() => {
    mongoose.connection.close()
})