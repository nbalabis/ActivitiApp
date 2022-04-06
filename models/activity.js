const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ActivitySchema = new Schema({
    title: String,
    theme: {
        type: String,
        enum: ['Animals', 'Art and Design', 'Culture, Society, and Science', 'Drink', 'Food', 'Entertainment', 'History and Literature', 'Nature and Outdoors', 'Sightseeing, Shopping, and Transportation', 'Sports', 'Wellness']
    },
    image: String,
    price: Number,
    description: String,
    location: String
})

module.exports = mongoose.model('Activity', ActivitySchema)