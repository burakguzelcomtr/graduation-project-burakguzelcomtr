const express = require('express')

const router = express.Router()

const UserManager = require('../managers/user-manager')

/* GET student listing. */
router.get('/', async (req, res) => {
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
router.get('/class-group/:classGroupId', async (req, res) => {
  try {
    const students = await UserManager.getStudentsByClassGroup(req.params.classGroupId)
    res.send(students)
  } catch (error) {
    res.status(error.status ?? 500).send({ error: error.message })
  }
})

/* GET student by id. */
router.get('/:id', async (req, res) => {
  try {
    const student = await UserManager.getStudentById(req.params.id)
    res.send(student)
  } catch (error) {
    res.status(error.status ?? 500).send({ error: error.message })
  }
})

/* PATCH update student profile (hero, country, studentId, grade, section, campus). */
router.patch('/:id/profile', async (req, res) => {
  try {
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
router.post('/', async (req, res) => {
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
