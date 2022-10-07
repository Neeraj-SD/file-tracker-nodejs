const express = require('express');
const auth = require('../middlewares/auth');
const validObjectId = require('../middlewares/validObjectId');

const { Request, History, validate } = require('../models/request')
const { Department } = require('../models/department')
const { Role } = require('../models/role');
const { Faculty } = require('../models/faculty');
const { Student } = require('../models/student');

const router = express.Router();


const requestAction = async (req, res, action) => {
    const { id, remarks } = req.body
    if (!id) return res.status(400).send("Invalid request id")

    const request = await Request.findById(req.body.id).populate(['current_position'])
    if (!request) return res.status(404).send('Request with the given id not found')

    const { current_position } = request

    if (current_position.status !== 'waiting')
        return res.status(400).send('Cannot perfom action.')

    if (action === 'approve')
        current_position.status = 'approved'
    else if (action === 'reject')
        current_position.status = 'rejected'

    await current_position.save()

    res.status(200).send(request)

}

router.get('/', async (req, res) => {

    const requests = await Request.find().populate(['history'])

    return res.status(200).send(requests)
})

router.get('/:id', [validObjectId('id')], async (req, res) => {
    const id = req.params.id
    const request = await Request.findById(id).populate(['history'])

    if (!request) return res.status(404).send("No request found.")

    return res.status(200).send(request)
})


router.post('/', async (req, res) => {
    const { value, error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message)

    const from = await Student.findById(value.from)
    if (!from) return res.status(400).send("Invalid student.")

    const to = await Faculty.findById(value.to)
    if (!to) return res.status(400).send("Invalid faculty to send to.")

    let history = new History({
        at: to,

    })

    history = await history.save()

    request = new Request({
        header: value.header,
        body: value.body,
        from: from,
        to: to,
        current_position: history.id,
        history: [history],
    });

    await request.save();

    return res.status(201).send(request);
})

router.post('/approve', async (req, res) => {
    return requestAction(req, res, 'approve')
})

router.post('/reject', async (req, res) => {
    return requestAction(req, res, 'reject')
})

router.post('/forward', async (req, res) => {

    const { id, to, remarks } = req.body
    if (!id || !to) return res.status(400).send("Invalid arguments sent.")

    const forwaredFaculty = await Faculty.findById(req.body.to)
    if (!forwaredFaculty) return res.status(404).send('Faculty with the given id not found')

    const request = await Request.findById(req.body.id).populate('current_position')
    if (!request) return res.status(404).send('Request with the given id not found')

    const { current_position } = request


    if (current_position.status !== 'waiting')
        return res.status(400).send('Cannot perfom action.')

    current_position.status = 'forwarded'

    let newPosition = new History({
        at: forwaredFaculty,
        remarks: remarks
    })

    newPosition = await newPosition.save()

    request.history.push(newPosition)
    request.current_position = newPosition

    await current_position.save()
    await request.save()

    res.status(200).send(request)

})

module.exports = router;