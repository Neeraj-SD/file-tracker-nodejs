const express = require('express');
const auth = require('../middlewares/auth');
const validObjectId = require('../middlewares/validObjectId');

const { Student, validate } = require('../models/student')
const { Department } = require('../models/department')
const { Role } = require('../models/role')

const router = express.Router();

router.get('/', async (req, res) => {

    const students = await Student.find()

    return res.status(200).send(students)
})

router.get('/:id', [validObjectId('id')], async (req, res) => {
    const id = req.params.id
    const student = await Student.findById(id)

    if (!student) return res.status(404).send("No student found.")

    return res.status(200).send(student)
})


router.post('/', async (req, res) => {
    const { value, error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message)

    let student = await Student.findOne({ email: value.email })
    if (student) return res.status(400).send("Student already exists")

    const department = await Department.findById(value.department)
    if (!department) return res.status(400).send("Invalid department")

    // const role = await Role.findById(value.role)
    // if (!role) return res.status(400).send("Invalid role")


    student = new Student({
        name: value.name,
        email: value.email,
        department: department,
        batch: value.batch
    });

    await student.save();

    return res.status(201).send(student);
})

module.exports = router;