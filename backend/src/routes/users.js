const express = require('express')

const router = express.Router()

const User = require('../models/user')

/* GET /users/me
 * Returns the User profile for the currently logged-in account.
 */
router.get('/me', async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: 'Not authenticated' })
  }
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
router.get('/:id', async (req, res) => {
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
