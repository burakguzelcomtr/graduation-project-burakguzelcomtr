const express = require('express')

const router = express.Router()

const { celebrate, Joi, Segments } = require('celebrate')
const authorize = require('../middleware/authorize')
const UserManager = require('../managers/user-manager')

const objectId = Joi.string().hex().length(24)

/* GET student listing. */
router.get(
  '/',
  authorize('students', 'read'),
  celebrate({
    [Segments.QUERY]: Joi.object({
      grade: Joi.string(),
      section: Joi.string(),
      campus: Joi.string(),
    }),
  }),
  async (req, res) => {
  try {
    const { grade, section, campus } = req.query
    const query = {}
    if (grade != null) query.grade = grade
    if (section) query.section = section
    if (campus) query.campus = campus
    const students = await UserManager.getStudents(query)
    res.send(students)
  } catch (error) {
    res.status(error.status ?? 500).send({ error: error.message })
  }
})

/* GET students by class group. */
router.get(
  '/class-group/:classGroupId',
  authorize('students', 'read'),
  celebrate({ [Segments.PARAMS]: Joi.object({ classGroupId: objectId.required() }) }),
  async (req, res) => {
  try {
    const students = await UserManager.getStudentsByClassGroup(req.params.classGroupId)
    res.send(students)
  } catch (error) {
    res.status(error.status ?? 500).send({ error: error.message })
  }
})

/* GET student by id. */
router.get(
  '/:id',
  authorize('students', 'read'),
  celebrate({ [Segments.PARAMS]: Joi.object({ id: objectId.required() }) }),
  async (req, res) => {
  try {
    const student = await UserManager.getStudentById(req.params.id)
    res.send(student)
  } catch (error) {
    res.status(error.status ?? 500).send({ error: error.message })
  }
})

/* PATCH update student profile (hero, country, studentId, grade, section, campus). */
router.patch(
  '/:id/profile',
  authorize('students', 'update'),
  celebrate({
    [Segments.PARAMS]: Joi.object({ id: objectId.required() }),
    [Segments.BODY]: Joi.object({
      name: Joi.string(),
      surname: Joi.string(),
      hero: objectId.allow(null),
      country: objectId.allow(null),
      studentId: Joi.string(),
      grade: Joi.number().integer(),
      section: Joi.string(),
      campus: Joi.string(),
    }),
  }),
  async (req, res) => {
  try {
    const { role } = req.user.user
    if (role === 'student' && req.params.id !== req.user.user._id.toString()) {
      return res.status(403).send({ error: 'Forbidden' })
    }
    if (role === 'teacher') {
      const student = await UserManager.getStudentById(req.params.id)
      const { grade: tGrade, section: tSection, campus: tCampus } = req.user.user
      if (student.grade !== tGrade || student.section !== tSection || student.campus !== tCampus) {
        return res.status(403).send({ error: 'Forbidden' })
      }
    }
    const { name, surname, hero, country, studentId, grade, section, campus } = req.body
    const update = {}
    if (name !== undefined) update.name = name
    if (surname !== undefined) update.surname = surname
    if (hero !== undefined) update.hero = hero || null
    if (country !== undefined) update.country = country || null
    if (studentId !== undefined) update.studentId = studentId
    if (grade !== undefined) update.grade = grade
    if (section !== undefined) update.section = section
    if (campus !== undefined) update.campus = campus
    const student = await UserManager.updateStudentProfile(req.params.id, update)
    res.send(student)
  } catch (error) {
    res.status(error.status ?? 400).send({ error: error.message })
  }
})

/* POST create a new student. */
router.post(
  '/',
  authorize('students', 'create'),
  celebrate({
    [Segments.BODY]: Joi.object({
      name: Joi.string().required(),
      surname: Joi.string().required(),
      studentId: Joi.string(),
      grade: Joi.number().integer().required(),
      section: Joi.string().required(),
      campus: Joi.string().required(),
      classGroup: objectId,
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }),
  }),
  async (req, res) => {
  try {
    const { name, surname, studentId, grade, section, campus, classGroup, email, password } = req.body
    const newStudent = await UserManager.createStudent({
      name,
      surname,
      studentId,
      grade,
      section,
      campus,
      classGroup,
      email,
      password,
    })
    res.send(newStudent)
  } catch (error) {
    res.status(error.status ?? 400).send({ error: error.message })
  }
})

module.exports = router
