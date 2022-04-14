const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema

const ActivitySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    host: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    theme: {
        type: String,
        enum: ['Animals', 'Art and Design', 'Culture, Society, and Science', 'Drink', 'Food', 'Entertainment', 'History and Literature', 'Nature and Outdoors', 'Sightseeing, Shopping, and Transportation', 'Sports', 'Wellness']
    },
    images: [
        {
            url: String,
            filename: String
        }
    ],
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

ActivitySchema.virtual('numReviews').get(function () {
    let numReviews = 0
    for (let review of this.reviews) {
        numReviews++
    }
    return numReviews
})

ActivitySchema.virtual('avgRating').get(function () {
    let total = 0
    let numReviews = 0
    for (let review of this.reviews) {
        total += review.rating
        numReviews++
    }
    return Math.round((total / numReviews) * 2) / 2
})

ActivitySchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Activity', ActivitySchema)