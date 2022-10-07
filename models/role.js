const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const jwt = require('jsonwebtoken')
const config = require('config')

const roleSchema = mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 255 },

}, {
    timestamps: true
})

const Role = mongoose.model('Role', roleSchema)

const roleJoiSchema = Joi.object({
    name: Joi.string().required().min(1).max(255),
})

const validate = role => roleJoiSchema.validate(role)

// export { Role, validate }
exports.Role = Role
exports.validate = validate