const express = require('express')
const cors = require('cors')
const reviews = require('./api/reviews.route.js')

const app = express()

app.use(cors())
app.use(express.json())

app.use("/reviews", reviews)
app.use("*", (req, res) => res.status(404).json({ error: "not found"}))

module.exports = app