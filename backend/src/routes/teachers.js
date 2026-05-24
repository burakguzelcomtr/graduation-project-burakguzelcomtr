const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()

const { celebrate, Joi, Segments } = require('celebrate')
const authorize = require('../middleware/authorize')
const User = require('../models/user')
const Account = require('../models/account')

const objectId = Joi.string().hex().length(24)

/* GET teacher listing. */
router.get('/', authorize('teachers', 'read'), async (req, res) => {
  // TODO: Implement pagination and filtering by class group
  try {
    const teachers = await User.Teacher.find()
    if (!teachers || teachers.length === 0) {
      return res.status(404).send({ error: 'No teachers found' })
    }
    return res.send(teachers)
  } catch (error) {
    return res.status(500).send({ error: error.message })
  }
})

/* GET teacher by id. */
router.get(
  '/:id',
  authorize('teachers', 'read'),
  celebrate({ [Segments.PARAMS]: Joi.object({ id: objectId.required() }) }),
  async (req, res) => {
  try {
    const { id } = req.params
    const teacher = await User.Teacher.findById(id)
    if (!teacher) {
      return res.status(404).send({ error: 'Teacher not found' })
    }
    return res.send(teacher)
  } catch (error) {
    return res.status(500).send({ error: error.message })
  }
})

// GET teacher by class group
router.get(
  '/class-group/:classGroupId',
  authorize('teachers', 'read'),
  celebrate({ [Segments.PARAMS]: Joi.object({ classGroupId: objectId.required() }) }),
  async (req, res) => {
  try {
    const { classGroupId } = req.params
    const teacher = await User.Teacher.find({ classGroup: classGroupId })
    if (!teacher || teacher.length === 0) {
      res.status(404).send({ error: 'No teachers found for this class group' })
    }
    res.send(teacher)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

/* POST create a new teacher. */
router.post(
  '/',
  authorize('teachers', 'create'),
  celebrate({
    [Segments.BODY]: Joi.object({
      name: Joi.string().required(),
      surname: Joi.string().required(),
      grade: Joi.number().integer().required(),
      section: Joi.string().required(),
      campus: Joi.string().required(),
      classGroup: objectId,
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }),
  }),
  async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { name, surname, grade, section, campus, classGroup, email, password } = req.body
    const [newTeacher] = await User.Teacher.create([{ name, surname, grade, campus, section, classGroup }], { session })
    // eslint-disable-next-line no-underscore-dangle
    const account = new Account({ email, user: newTeacher._id })
    await account.setPassword(password)
    await account.save({ session })
    await session.commitTransaction()
    return res.send(newTeacher)
  } catch (error) {
    await session.abortTransaction()
    return res.status(400).send({ error: error.message })
  } finally {
    session.endSession()
  }
})

router.delete(
  '/:id',
  authorize('teachers', 'delete'),
  celebrate({ [Segments.PARAMS]: Joi.object({ id: objectId.required() }) }),
  async (req, res) => {
  try {
    const { id } = req.params
    const deletedTeacher = await User.Teacher.findByIdAndDelete(id)
    if (!deletedTeacher) {
      return res.status(404).send({ error: 'Teacher not found' })
    }
    return res.send(deletedTeacher)
  } catch (error) {
    return res.status(500).send({ error: error.message })
  }
})

module.exports = router
