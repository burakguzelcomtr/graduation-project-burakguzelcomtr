const express = require('express')

const router = express.Router()
const User = require('../models/user')

router.get('/session', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user })
  } else {
    res.json({ authenticated: false })
  }
})

module.exports = router
