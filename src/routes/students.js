const express = require('express')

const router = express.Router()

const StudentManager = require('../student-manager')

const studentManager = new StudentManager()

/* GET student listing. */
router.get('/', (req, res) => {
  try {
    res.send(studentManager.getStudents())
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

/* POST create a new student. */
router.post('/', (req, res) => {
  try {
    const { name, surname, grade, section } = req.body
    const newStudent = studentManager.createStudent({ name, surname, grade, section })
    res.send(newStudent)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

module.exports = router
