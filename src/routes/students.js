var express = require('express');
var router = express.Router();

const generateId = require('../id-generator')
const Student = require('../student')

/* GET student listing. */
router.get('/', function(req, res, next) { 
  res.send(Student.list)
})

router.post('/', function(req, res, next) {
  const { name, surname, grade, section } = req.body
  if (!name || !surname || !grade || !section) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  const newStudent = Student.createStudent({ name, surname, grade, section }) 
  res.send(newStudent)
})

module.exports = router;
