let metadata;
let characteristics;

module.exports = {
  injectDB: async (client) => {
    if (metadata) {
      return
    }
    try {
      metadata = await client.db('raw-review').collection('metadata');
      characteristics = await client.db('raw-review').collection('characteristics')
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
      return { results: [] };
    }
  },
  addMetadata: async (data) => {
    try {
      const cursor = await metadata.insertOne(data)
      return cursor;
    } catch (e) {
      console.error(`Uhhh, unalbe to insert to database ${e}`)
    }
  },
  getCharsName: async (id) => {
    try {
      const cursor = await characteristics.findOne({ 'id': id }, { 'projection': { _id: 0, name: 1 }})
      return cursor.name;
    } catch (e) {
      console.error(`Uhhh, no characteristic ID found with the id ${e}`)
      return '';
    }
  },

}