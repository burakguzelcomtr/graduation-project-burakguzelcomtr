const express = require('express')

const router = express.Router()

const User = require('../models/user') 

/* GET student listing. */
router.get('/', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).lean()
    res.send(students)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

/* POST create a new student. */
router.post('/', async (req, res) => {
  try {
    const { name, surname, grade, section } = req.body
    const newStudent = await User.create({ name, surname, grade, section, role: 'student' })
    res.send(newStudent)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

module.exports = router
