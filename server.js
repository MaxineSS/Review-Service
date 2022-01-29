// const newrelic = require('newrelic');
const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const reviews = require('./api/reviews.route.js');
const ReviewModel = require('./model/reviews.model.js');
const MetaModel = require('./model/metadata.model.js');
const app = express();

const dotenv = require('dotenv').config();
const port = process.env.SERVER_PORT;
const uri = process.env.DB_URI;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

MongoClient.connect(uri, { maxPoolSize: 50 })
  .then(async client => {
  await ReviewModel.injectDB(client);
  await MetaModel.injectDB(client);
  console.log('Connected successfully to mongodb server');

  app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
  });
})
.catch(err => {
  console.log(`Can't connect to mongodb server ${err}`)
})

app.use("/reviews", reviews)
app.get('/loaderio-293591338c16b52708af520ffc3c86e2', (req, res) => {
  res.send('loaderio-293591338c16b52708af520ffc3c86e2')
})
app.get('/', (req, res) => res.status(200).json('main route'))
app.use("*", (req, res) => res.status(404).json({ error: "not found" }))
