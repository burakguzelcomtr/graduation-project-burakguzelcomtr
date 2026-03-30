const express = require('express')

const router = express.Router()
const passport = require('passport')

router.get('/session', async (req, res) => {
  res.send(req.user)
})

router.post('/session', passport.authenticate('local', { failWithError: true }), (req, res) => {
  res.send(req.user)
})

router.delete('/session', async (req, res) => {
  req.logout(() => {
    res.sendStatus(200)
  })
})

module.exports = router
