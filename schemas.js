const Joi = require('joi')

module.exports.activitySchema = Joi.object({
    activity: Joi.object({
        title: Joi.string().required(),
        //FIXME: theme
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required()
    }).required()
})