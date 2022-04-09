const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema

const ActivitySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    theme: {
        type: String,
        enum: ['Animals', 'Art and Design', 'Culture, Society, and Science', 'Drink', 'Food', 'Entertainment', 'History and Literature', 'Nature and Outdoors', 'Sightseeing, Shopping, and Transportation', 'Sports', 'Wellness']
    },
    image: {
        type: String,
        required: true
    },
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