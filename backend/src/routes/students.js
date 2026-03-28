const express = require('express')

const router = express.Router()

const User = require('../models/user')

/* GET student listing. */
router.get('/', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
    res.send(students)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

/* GET students by class group. */
router.get('/class-group/:classGroupId', async (req, res) => {
  try {
    const { classGroupId } = req.params
    const students = await User.find({ classGroup: classGroupId, role: 'student' })
    res.send(students)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

/* GET student by id. */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const student = await User.findOne({ _id: id, role: 'student' })
    if (!student) {
      res.status(404).send({ error: 'Student not found' })
      return
    }
    res.send(student)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

/* POST create a new student. */
router.post('/', async (req, res) => {
  try {
    const { name, surname, studentId, grade, section, campus, classGroup, email, password } = req.body
    const newStudent = await User.register(
      new User({ name, surname, email, studentId, grade, campus, section, role: 'student', classGroup }),
      password
    )
    res.send(newStudent)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

module.exports = router
