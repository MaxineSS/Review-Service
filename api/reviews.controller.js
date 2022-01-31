let client;
const ReviewModel = require('../model/reviews.model.js')
const MetaModel = require('../model/metadata.model.js')

module.exports = {
  initializeCache: (redis) => {
    try {
      client = redis
    } catch (e) {
      console.error(e)
    }
  },
  apiGetReviews: async (req, res) => {
    const page = req.query.page ? Number(req.query.page) : 0;
    const count = req.query.count ? Number(req.query.count) : 5;
    const sort = req.query.sort ? req.query.sort : 'relevant';
    const product_id = Number(req.query.product_id);

    try {
      client.get(`reviews:${product_id}`)
        .then(async (reviews) => {
          if (reviews) {
            res.status(200).json(JSON.parse(reviews))
          } else {
            let reviewList = await ReviewModel.getReviews(page, count, sort, product_id)
            let response = {
              product: product_id,
              page: page,
              count: count,
              results: reviewList
            }
            await client.set(`reviews:${product_id}`, JSON.stringify(response), { EX: 600, NX: true })
            res.status(200).json(response)
          }
        })
        .catch((e) => console.log(e))
    } catch (e) {
      res.status(500).json({ error: e })
    }
  },
  apiPostReview: async (req, res) => {
    const review = req.body;
    const part1 = {
      body: review.body,
      date: new Date(),
      helpfulness: 0,
      photos: [],
      product_id: Number(review.product_id),
      rating: Number(review.rating),
      recommend: Boolean(review.recommend),
      reported: false,
      response: null,
      review_id: 0,
      reviewer_email: review.email,
      reviewer_name: review.name,
      summary: review.summary
    }
    const part2 = {
      _id: 0,
      characteristics: [],
      product_id: Number(review.product_id),
      rating: Number(review.rating),
      recommend: Boolean(review.recommend)
    }

    if (review.photos.length > 0) {
      review.photos.forEach(url => part1.photos.push({ 'url': url }))
    }

    let newReviewId;
    try {
      newReviewId = Date.now() + Math.random()
      part1.review_id = newReviewId;
      part2._id = newReviewId;
    } catch (e) {
      console.error(`Coulnd't find last inserted review_id ${e}`)
    }

    let found;
    try {
      for (let key in review.characteristics) {
        found = await MetaModel.getCharsName(Number(key))
        part2.characteristics.push({'id': Number(key), 'name': found, 'value': Number(review.characteristics[key])})
      }
    } catch (e) {
      console.error(`Couldn't match the name of characteristic ${e}`)
    }

    try {
      const result = await ReviewModel.createReview(part1, part2)
      res.status(201).json({'success': result})
    } catch (e) {
      res.status(500).json({'error': e.message })
    }

  },
  apiUpdateHelpful: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await ReviewModel.updateHelpful(Number(id))
      res.json({ status: 'Updated' })
    } catch (e) {
      res.status(500).json({ 'error': e.message })
    }
  },
  apiUpdateReport: async (req, res) => {
    const { id } = req.params;
    try {
      const response = await ReviewModel.updateReport(Number(id))
      res.json({ status: 'Reported' })
    } catch (e) {
      res.status(500).json({ 'error': e.message })
    }
  }
}