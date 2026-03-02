const express = require('express')

const router = express.Router()

const User = require('../models/user')

/* GET teacher listing. */
router.get('/', async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).lean()
    res.send(teachers)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

/* POST create a new teacher. */
router.post('/', async (req, res) => {
  try {
    const { name, surname, grade, section } = req.body
    const newTeacher = await User.create({ name, surname, grade, section, role: 'teacher' })
    res.send(newTeacher)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

module.exports = router
