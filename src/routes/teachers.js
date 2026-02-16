var express = require('express');
var router = express.Router();

const generateId = require('../id-generator')
const Teacher = require('../teacher')

/* GET teacher listing. */
router.get('/', function(req, res, next) { 
  res.send(Teacher.list)
})

router.post('/', function(req, res, next) {
  const { name, surname, grade, section } = req.body
  if (!name || !surname || !grade || !section) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  const newTeacher = Teacher.createTeacher({ name, surname, grade, section }) 
  res.send(newTeacher)
})

module.exports = router;
