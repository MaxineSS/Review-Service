// const newrelic = require('newrelic');
const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv').config();

const port = process.env.SERVER_PORT;
const uri = process.env.DB_URI;
const redisURL = process.env.REDIS_URL;

const bodyParser = require('body-parser');
const app = express();
const redis = require('redis').createClient({ url: redisURL }) ;

const reviews = require('./api/reviews.route.js');
const ReviewModel = require('./model/reviews.model.js');
const MetaModel = require('./model/metadata.model.js');
const Rctr = require('./api/reviews.controller.js')
const Mctr = require('./api/metadata.controller.js')

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

MongoClient.connect(uri, { maxPoolSize: 50 })
  .then(async client => {
    await ReviewModel.injectDB(client);
    await MetaModel.injectDB(client);
    console.log('💃 Connected successfully to mongodb server');

    redis.on('error', (err) => console.log('Redis Client Error', err));
    redis.on('connect', () => console.log('💃 Connected successfully to redis server'));
    await redis.connect();

    Rctr.initializeCache(redis)
    Mctr.initializeCache(redis)

    app.listen(port, () => {
      console.log(`Server is listening on port: ${port}`);
    });
})
.catch(err => {
  console.log(`Can't connect to mongodb server ${err}`)
})

app.use("/reviews", reviews)
app.get('/loaderio-8b377618aad9d93969038af260fe392e', (req, res) => {
  res.send('loaderio-8b377618aad9d93969038af260fe392e')
})
app.get('/', (req, res) => res.status(200).json('main route'))
app.use("*", (req, res) => res.status(404).json({ error: "not found" }))
