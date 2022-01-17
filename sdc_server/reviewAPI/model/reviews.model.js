const MetaModel = require('./metadata.model.js');
// const mongodb = require('mongodb')
// const { ObjectId } = mongodb;
let reviews;

module.exports = {
  injectDB: async (client) => {
    if (reviews) {
      return;
    }
    try {
      reviews = await client.db('raw-review').collection('reviews');
    } catch(e) {
      console.error(`Unable to establish a collection handle in reviewService: ${e}`)
    }
  },
  getReviews: async (page, count, sort, product_id) => {
    let pipeline = [{ $match: { 'product_id': product_id }}]
    if (sort) {
      switch (sort) {
        case 'newest':
          pipeline.push({ '$sort': { 'date': -1 } })
          break;
        case 'helpful':
          pipeline.push({ '$sort': { 'helpfulness': -1 } })
          break;
        case 'relevant':
          pipeline.push({ '$sort': { 'helpfulness': -1, 'date': -1 } })
          break;
      }
    } else {
      pipeline.push({ '$sort': { 'helpfulness': -1, 'date': -1 }})
    }

    let aggCursor;
    try {
      aggCursor = await reviews.aggregate(pipeline)
    } catch (e) {
      console.error(`Uhhh, unable to proceed aggregation, ${e}`)
      return { results: [] }
    }

    const displayCursor = aggCursor.limit(count).skip(count * page)
    try {
      const reviewList = await displayCursor.toArray();
      return reviewList;
    } catch (e) {
      console.error(`Uhhh, unable to convert cursor to array, ${e}`)
      return { results: [] }
    }
  },
  getLastInsertedDoc: async () => {
    const pipeline = [
      {
        '$sort': {
          'review_id': -1
        }
      }, {
        '$project': {
          'review_id': 1,
          '_id': 0
        }
      }, {
        '$limit': 1
      }
    ]
    try {
      const aggCursor = await reviews.aggregate(pipeline).toArray()
      return aggCursor[0].review_id;
    } catch (e) {
      console.error(`Uhhh, unable to proceed aggregation, ${e}`)
      return { results: 0 }
    }
  },
  createReview: async (part1, part2) => {
    try {
      await reviews.insertOne(part1)
      return await MetaModel.addMetadata(part2)
    } catch (e) {
      console.error(`Uhhh, unable to post review ${e}`)
      return { 'error': e }
    }
  },
  updateHelpful: async (id) => {
    try {
      const updateResponse = await reviews.updateOne({ 'review_id': id }, { $inc: { 'helpfulness': 1 } })
      return updateResponse;
    } catch (e) {
      console.error(`Uhhh, unable to increment helpfulness count ${e}`)
      return { 'error': e }
    }
  },
  updateReport: async (id) => {
    try {
      const updateResponse = await reviews.updateOne({ 'review_id': id }, { $set: { 'reported': true } })
      return updateResponse;
    } catch (e) {
      console.error(`Uhhh, unable to report the review ${e}`)
      return { 'error': e }
    }
  }
}
