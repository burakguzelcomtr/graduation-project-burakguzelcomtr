const express = require('express')

const router = express.Router()

const User = require('../models/user')

/* GET teacher listing. */
router.get('/', async (req, res) => {
  // TODO: Implement pagination and filtering by class group
  try {
    const teachers = await User.find({ role: 'teacher' })
    if (!teachers || teachers.length === 0) {
      return res.status(404).send({ error: 'No teachers found' })
    }
    return res.send(teachers)
  } catch (error) {
    return res.status(500).send({ error: error.message })
  }
})

/* GET teacher by id. */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const teacher = await User.findOne({ _id: id, role: 'teacher' })
    if (!teacher) {
      return res.status(404).send({ error: 'Teacher not found' })
    }
    return res.send(teacher)
  } catch (error) {
    return res.status(500).send({ error: error.message })
  }
})

// GET teacher by class group
router.get('/class-group/:classGroupId', async (req, res) => {
  try {
    const { classGroupId } = req.params
    const teacher = await User.find({ classGroup: classGroupId, role: 'teacher' })
    if (!teacher || teacher.length === 0) {
      res.status(404).send({ error: 'No teachers found for this class group' })
    }
    res.send(teacher)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

/* POST create a new teacher. */
router.post('/', async (req, res) => {
  try {
    const { name, surname, grade, section, campus, classGroup, email, password } = req.body
    const newTeacher = await User.register(
      new User({ name, surname, email, grade, campus, section, role: 'teacher', classGroup }),
      password
    )
    return res.send(newTeacher)
  } catch (error) {
    return res.status(500).send({ error: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deletedTeacher = await User.findOneAndDelete({ _id: id, role: 'teacher' })
    if (!deletedTeacher) {
      return res.status(404).send({ error: 'Teacher not found' })
    }
    return res.send(deletedTeacher)
  } catch (error) {
    return res.status(500).send({ error: error.message })
  }
})

module.exports = router
