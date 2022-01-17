const { MongoClient } = require('mongodb');
const ReviewModel = require('./model/reviews.model.js');
const MetaModel = require('./model/metadata.model.js');

const uri = 'mongodb://localhost:27017';

module.exports = async function main(app) {
  const client = await new MongoClient(uri, { maxPoolSize: 50 })
  try {
    await client.connect()

    await ReviewModel.injectDB(client);
    await MetaModel.injectDB(client);
    console.log('Connected successfully to mongodb server');

    app.listen(3000, () => {
      console.log('Server is listening on port: 3000');
    });

  } catch (e) {
    console.log(`Can't connect to mongodb server ${e}`)
  }
}



