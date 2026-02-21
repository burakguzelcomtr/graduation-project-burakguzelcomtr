const express = require('express')

const router = express.Router()

const ClassGroupManager = require('../class-group-manager')

const classGroupManager = new ClassGroupManager()

/* GET class group listing. */
router.get('/', (req, res) => {
  try {
    res.send(classGroupManager.getClassGroups())
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

/* GET class group by id. */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params
    const classGroup = classGroupManager.getClassGroupById(id)
    res.send(classGroup)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

/* POST create a new class group. */
router.post('/', (req, res) => {
  try {
    const { grade, section } = req.body
    const classGroup = classGroupManager.createClassGroup({ grade, section })
    res.send(classGroup)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

module.exports = router