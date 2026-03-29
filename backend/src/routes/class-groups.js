const express = require('express')

const router = express.Router()

const ClassGroupManager = require('../managers/class-group-manager')

/* GET class group listing. */
router.get('/', async (req, res) => {
  try {
    const classGroups = await ClassGroupManager.getClassGroups()
    res.send(classGroups)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

/* GET class group by id. */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const classGroup = await ClassGroupManager.getClassGroupById(id)
    return res.send(classGroup)
  } catch (error) {
    return res.status(error.status || 500).send({ error: error.message })
  }
})

/* POST create a new class group. */
router.post('/', async (req, res) => {
  try {
    const { grade, section, campus } = req.body
    const classGroup = await ClassGroupManager.createClassGroup({ grade, section, campus })
    return res.send(classGroup)
  } catch (error) {
    return res
      .status(error.status || 500)
      .send({ error: error.message, campus: req.body.campus, grade: req.body.grade, section: req.body.section })
  }
})

module.exports = router
