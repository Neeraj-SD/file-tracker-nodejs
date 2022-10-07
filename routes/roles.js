const express = require('express');
const auth = require('../middlewares/auth');
const validObjectId = require('../middlewares/validObjectId');

const { Role, validate } = require('../models/role')

const router = express.Router();

router.get('/', async (req, res) => {

    const roles = await Role.find()

    return res.status(200).send(roles)
})

router.get('/:id', [validObjectId('id')], async (req, res) => {
    const id = req.params.id
    const role = await Role.findById(id)

    if (!role) return res.status(404).send("No role found.")

    return res.status(200).send(role)
})


router.post('/', async (req, res) => {
    const { value, error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message)

    let role = await Role.findOne({ name: value.name })
    if (role) return res.status(400).send("Role already exists")

    role = new Role({
        name: value.name
    });

    await role.save();

    return res.status(201).send(role);
})

module.exports = router;