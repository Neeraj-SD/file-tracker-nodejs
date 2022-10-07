const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const jwt = require('jsonwebtoken')
const config = require('config')

const departmentSchema = mongoose.Schema({
    name: { type: String, unique: true, required: true, minlength: 3, maxlength: 255 },

}, {
    timestamps: true
})

const Department = mongoose.model('Department', departmentSchema)

const departmentJoiSchema = Joi.object({
    name: Joi.string().required().min(1).max(255),
})

// const validate = (department) => departmentJoiSchema(department)

const validate = function (department) {
    return departmentJoiSchema.validate(department)
}

exports.Department = Department
exports.validate = validate