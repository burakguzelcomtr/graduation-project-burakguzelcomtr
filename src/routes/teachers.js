const express = require('express')

const router = express.Router()

const TeacherManager = require('../teacher-manager')

const teacherManager = new TeacherManager()

/* GET teacher listing. */
router.get('/', (req, res) => {
  try {
    res.send(teacherManager.getTeachers())
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

/* POST create a new teacher. */
router.post('/', (req, res) => {
  try {
    const { name, surname, grade, section } = req.body
    const newTeacher = teacherManager.createTeacher({ name, surname, grade, section })
    res.send(newTeacher)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

module.exports = router
