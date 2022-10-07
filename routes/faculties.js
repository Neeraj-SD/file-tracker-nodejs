const express = require('express');
const auth = require('../middlewares/auth');
const validObjectId = require('../middlewares/validObjectId');

const { Faculty, validate } = require('../models/faculty')
const { Department } = require('../models/department')
const { Role } = require('../models/role')

const router = express.Router();

router.get('/', async (req, res) => {

    const faculties = await Faculty.find()

    return res.status(200).send(faculties)
})

router.get('/:id', [validObjectId('id')], async (req, res) => {
    const id = req.params.id
    const faculty = await Faculty.findById(id)

    if (!faculty) return res.status(404).send("No faculty found.")

    return res.status(200).send(faculty)
})


router.post('/', async (req, res) => {
    const { value, error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message)

    let faculty = await Faculty.findOne({ email: value.email })
    if (faculty) return res.status(400).send("Faculty already exists")

    const department = await Department.findById(value.department)
    if (!department) return res.status(400).send("Invalid department")

    const role = await Role.findById(value.role)
    if (!role) return res.status(400).send("Invalid role")


    faculty = new Faculty({
        name: value.name,
        email: value.email,
        department: department,
        role: role
    });

    await faculty.save();

    return res.status(201).send(faculty);
})

module.exports = router;