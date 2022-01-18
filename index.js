const { MongoClient } = require('mongodb');
const ReviewModel = require('./model/reviews.model.js');
const MetaModel = require('./model/metadata.model.js');
// const app = require('./server.js')

const uri = 'mongodb://44.202.35.18:27017';

// MongoClient.connect(uri, { maxPoolSize: 50 })
// .then(async client => {
//   await ReviewModel.injectDB(client);
//   await MetaModel.injectDB(client);
//   console.log('Connected successfully to mongodb server');

//   app.listen(5000, () => {
//     console.log('Server is listening on port: 5000');
//   });
// })
// .catch(err => {
//   console.log(`Can't connect to mongodb server ${err}`)
// })

