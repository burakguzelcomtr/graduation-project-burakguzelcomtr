const express = require('express')

const router = express.Router()

const ClassGroupManager = require('../managers/class-group-manager')

const classGroupManager = new ClassGroupManager()

/* GET class group listing. */
router.get('/', async (req, res) => {
  try {
    const classGroups = await classGroupManager.getClassGroups()
    res.send(classGroups)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

/* GET class group by id. */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const classGroup = await classGroupManager.getClassGroupById(id)
    res.send(classGroup)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

/* POST create a new class group. */
router.post('/', async (req, res) => {
  try {
    const { grade, section } = req.body
    const classGroup = await classGroupManager.createClassGroup({ grade, section })
    res.send(classGroup)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

module.exports = router