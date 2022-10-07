const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const jwt = require('jsonwebtoken')
const config = require('config')

const historySchema = mongoose.Schema({
    at: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Faculty' },
    status: { type: String, enum: ['forwarded', 'approved', 'rejected', 'waiting'], default: 'waiting' },
    remarks: { type: String, minlength: 1, maxlength: 1000 },

}, {
    timestamps: true
})

const requestSchema = mongoose.Schema({
    header: { type: String, required: true, minlength: 3, maxlength: 255 },
    body: { type: String, required: true, minlength: 3, maxlength: 1000 },
    from: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Student' },
    to: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Faculty' },
    current_position: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'History' },
    history: { type: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'History' }], default: undefined },
}, {
    timestamps: true
})

const Request = mongoose.model('Request', requestSchema)
const History = mongoose.model('History', historySchema)

const requestJoiSchema = Joi.object({
    header: Joi.string().required().min(1).max(255),
    body: Joi.string().required().min(3).max(1000),
    from: Joi.objectId(),
    to: Joi.objectId().required(),
})

const validate = request => requestJoiSchema.validate(request)

exports.Request = Request
exports.History = History
exports.validate = validate