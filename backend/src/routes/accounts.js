const express = require('express')

const router = express.Router()
const passport = require('passport')
const User = require('../models/user')

async function getSessionUser(account) {
  if (!account?.user) {
    return null
  }

  return User.findById(account.user)
}

router.get('/session', async (req, res) => {
  res.send(await getSessionUser(req.user))
})

router.post('/session', passport.authenticate('local', { failWithError: true }), async (req, res) => {
  res.send(await getSessionUser(req.user))
})

router.delete('/session', async (req, res) => {
  req.logout(() => {
    res.sendStatus(200)
  })
})

module.exports = router
