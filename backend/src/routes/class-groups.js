const express = require('express')
const createError = require('http-errors')

const router = express.Router()

const ClassGroupManager = require('../managers/class-group-manager')

/* GET class group listing. */
router.get('/', async (req, res) => {
  try {
    const classGroups = await ClassGroupManager.getClassGroups()
    res.send(classGroups)
  } catch (error) {
    throw createError.InternalServerError(error.message)
  }
})

/* GET class group by id. */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const classGroup = await ClassGroupManager.getClassGroupById(id)
    if (!classGroup) {
      throw createError.NotFound('Class group not found')
    }
    res.send(classGroup)
  } catch (error) {
    throw createError.InternalServerError(error.message)
  }
})

/* POST create a new class group. */
router.post('/', async (req, res) => {
  try {
    const { grade, section, campus } = req.body
    if (!grade || !section || !campus) {
      throw createError.BadRequest('Grade, section and campus are required to create a class group')
    }
    const classGroup = await ClassGroupManager.createClassGroup({ grade, section, campus })
    res.send(classGroup)
  } catch (error) {
    throw createError.InternalServerError(error.message)
  }
})

/* DELETE a class group. */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    await ClassGroupManager.deleteClassGroup(id)
    res.sendStatus(200)
  } catch (error) {
    throw createError.InternalServerError(error.message)
  }
})

/* UPDATE a class group. */
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { grade, section, campus } = req.body
    if (!grade && !section && !campus) {
      throw createError.BadRequest('At least one of grade, section or campus must be provided for update')
    }
    const updatedClassGroup = await ClassGroupManager.updateClassGroup(id, { grade, section, campus })
    res.send(updatedClassGroup)
  } catch (error) {
    throw createError.InternalServerError(error.message)
  }
})

module.exports = router
