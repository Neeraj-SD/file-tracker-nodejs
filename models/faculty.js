const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const jwt = require('jsonwebtoken')
const config = require('config')

const facultySchema = mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 255 },
    email: { type: String, trim: true, lowercase: true, unique: true, },
    department: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Department' },
    role: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Role' },
}, { timestamps: true })

const Faculty = mongoose.model('Faculty', facultySchema)

const facultyJoiSchema = Joi.object({
    name: Joi.string().required().min(1).max(255),
    email: Joi.string().email().required(),
    department: Joi.objectId(),
    role: Joi.objectId(),
})

const validate = faculty => facultyJoiSchema.validate(faculty)

exports.Faculty = Faculty
exports.validate = validate