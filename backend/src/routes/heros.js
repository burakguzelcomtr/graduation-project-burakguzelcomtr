const express = require('express')
const Hero = require('../models/hero')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const heros = await Hero.find().sort({ name: 1 })
    res.send(heros)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

module.exports = router
