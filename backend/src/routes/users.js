const express = require('express')

const router = express.Router()

const { celebrate, Joi, Segments } = require('celebrate')
const authorize = require('../middleware/authorize')
const User = require('../models/user')

const objectId = Joi.string().hex().length(24)

/* GET /users/me
 * Returns the User profile for the currently logged-in account.
 */
router.get('/me', authorize('users', 'read'), async (req, res) => {
  try {
    const user = await User.findById(req.user.user)
    if (!user) {
      return res.status(404).send({ error: 'User not found' })
    }
    return res.send(user)
  } catch (error) {
    return res.status(500).send({ error: error.message })
  }
})

/* GET /users/:id */
router.get(
  '/:id',
  authorize('users', 'read'),
  celebrate({ [Segments.PARAMS]: Joi.object({ id: objectId.required() }) }),
  async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).send({ error: 'User not found' })
    }
    return res.send(user)
  } catch (error) {
    return res.status(500).send({ error: error.message })
  }
})

module.exports = router
