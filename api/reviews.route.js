const express = require('express');
const ReviewCntl = require('./reviews.controller.js');
const MetaCntl = require('./metadata.controller.js');

const router = express.Router();

router.route('/')
  .get(ReviewCntl.apiGetReviews)
  .post(ReviewCntl.apiPostReview)

router.route('/meta')
  .get(MetaCntl.apiGetMetadata)

router.route('/:id/helpful')
  .put(ReviewCntl.apiUpdateHelpful)

router.route('/:id/report')
    .put(ReviewCntl.apiUpdateReport)

module.exports = router;