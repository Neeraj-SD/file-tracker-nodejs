const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const jwt = require('jsonwebtoken')
const config = require('config')

const studentSchema = mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 255 },
    email: { type: String, trim: true, lowercase: true, unique: true, },
    department: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Department' },
    batch: { type: String, required: true, minlength: 3, maxlength: 255, lowercase: true },
}, { timestamps: true })

const Student = mongoose.model('Student', studentSchema)

const studentJoiSchema = Joi.object({
    name: Joi.string().required().min(1).max(255),
    email: Joi.string().email().required(),
    batch: Joi.string().required().min(1).max(255),
    department: Joi.objectId(),
})

const validate = student => studentJoiSchema.validate(student)

exports.Student = Student
exports.validate = validate