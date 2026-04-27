const express = require('express')
const createError = require('http-errors')

const router = express.Router()
const passport = require('passport')

async function sendSession(req, res, next) {
  try {
    if (!req.user) {
      return res.send(null)
    }

    await req.user.populate('user')
    return res.send(req.user)
  } catch (error) {
    return next(createError(error.status || 500, error.message || 'Failed to load session'))
  }
}

router.get('/session', sendSession)
router.post('/session', passport.authenticate('local', { failWithError: true }), sendSession)
router.delete('/session', (req, res, next) => {
  return req.logout(function handleLogout(error) {
    if (error) {
      return next(createError(error.status || 500, error.message || 'Failed to log out'))
    }

    return res.sendStatus(200)
  })
})

module.exports = router
