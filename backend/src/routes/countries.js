const express = require('express')
const Country = require('../models/country')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const countries = await Country.find().sort({ name: 1 })
    res.send(countries)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

module.exports = router
