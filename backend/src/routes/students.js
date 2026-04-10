const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()

const User = require('../models/user')
const Account = require('../models/account')

/* GET student listing. */
router.get('/', async (req, res) => {
  try {
    // TODO: Implement pagination and filtering by class group
    const students = await User.Student.find()
    res.send(students)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

/* GET students by class group. */
router.get('/class-group/:classGroupId', async (req, res) => {
  try {
    const { classGroupId } = req.params
    const students = await User.Student.find({ classGroup: classGroupId })
    res.send(students)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

/* GET student by id. */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const student = await User.Student.findById(id)
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
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { name, surname, studentId, grade, section, campus, classGroup, email, password } = req.body
    const [newStudent] = await User.Student.create(
      [{ name, surname, studentId, grade, campus, section, classGroup }],
      { session }
    )
    const account = new Account({ email, user: newStudent._id })
    await account.setPassword(password)
    await account.save({ session })
    await session.commitTransaction()
    res.send(newStudent)
  } catch (error) {
    await session.abortTransaction()
    res.status(400).send({ error: error.message })
  } finally {
    session.endSession()
  }
})

module.exports = router
