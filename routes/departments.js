const express = require('express');
const auth = require('../middlewares/auth');
const validObjectId = require('../middlewares/validObjectId');

const { Department, validate } = require('../models/department')

const router = express.Router();

router.get('/', async (req, res) => {

    const departments = await Department.find()

    return res.status(200).send(departments)
})

router.get('/:id', [validObjectId('id')], async (req, res) => {
    const id = req.params.id
    const department = await Department.findById(id)

    if (!department) return res.status(404).send("No department found.")

    return res.status(200).send(department)
})


router.post('/', async (req, res) => {
    const { value, error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message)

    let department = await Department.findOne({ name: value.name })
    if (department) return res.status(400).send("Department already exists")

    department = new Department({
        name: value.name
    });

    await department.save();

    return res.status(201).send(department);
})

// router.post('/test/send/:id', async (req, res) => {
//     const toUserId = req.params.id;

//     sendNotification();

//     return res.send(200)

//     // const toUser = await User.findById(toUserId);
//     // if (!toUser) return res.status(404).send("User not found");

//     // const { value, error } = validate(req.body);
//     // if (error) return res.status(400).send(error);

//     // const message = new Message({
//     //     body: value.body,
//     //     _from: 'from',
//     //     _to: toUserId,
//     // });

//     // await message.save();
//     // sendRedisMessage(message, toUserId)
//     // return res.status(201).send(message);
// });

// router.get('/unread', auth, async (req, res) => {
//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).send("User not found");

//     const messages = await Message.find({ _to: req.user.id });

//     messages.forEach(x => {
//         sendRedisMessage(x, user)
//     })

//     return res.status(200).send(messages);
// });

// router.get('/chat/:id', [auth, validObjectId('id')], async (req, res) => {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).send("User not found");
//     console.log(`from ${user._id} to ${req.user.id}`)

//     const messages = await Message
//         .find({ _from: user._id, _to: req.user.id })

//     messages.forEach(x => {
//         x.status = 'delivered'
//         x.save();
//     })

//     return res.status(200).send(messages);
// });




module.exports = router;