let metadata;
let characteristics;

module.exports = {
  injectDB: async (client) => {
    if (metadata) {
      return
    }
    try {
      metadata = await client.db(process.env.DB_NAME).collection('metadata');
      characteristics = await client.db(process.env.DB_NAME).collection('characteristics')
    } catch(e) {
      console.error(`Unable to establish a collection handle in metadata: ${e}`)
    }
  },
  getMetadata: async (product_id) => {
    const pipeline = [
      {
        '$match': {
          'product_id': product_id
        }
      }, {
        '$project': {
          '_id': 0,
          'product_id': 0
        }
      }
    ];

    let arrCursor;
    try {
      arrCursor = await metadata.aggregate(pipeline).toArray();
      return arrCursor;
    } catch (e) {
      console.error(`Uhhh, unable to proceed aggregation, ${e}`)
      return { error: e }
    }
  },
  addMetadata: async (data) => {
    try {
      await metadata.insertOne(data)
      return 'Successfully inserted into metadata';
    } catch (e) {
      console.error(`Uhhh, unalbe to insert to database ${e}`)
      return { error: e }
    }
  },
  getCharsName: async (id) => {
    try {
      const cursor = await characteristics.findOne({ 'id': id })
      return cursor.name;
    } catch (e) {
      console.error(`Uhhh, no characteristic ID found with the id ${e}`)
      return { error: e }
    }
  },

}