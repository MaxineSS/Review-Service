const MetaModel = require('../model/metadata.model.js')
const Helper = require('../helper/collect.meta.js');

module.exports = {
  apiGetMetadata: async (req, res) => {
    const product_id = Number(req.query.product_id);

    try {
      const metadata = await MetaModel.getMetadata(product_id)
      const collected = Helper.collectMetadata(metadata);
      const calculated = Helper.avgCharacteristic(collected.characteristics);

      let response = {
        product_id: product_id,
        ratings: collected.ratings,
        recommended: collected.ratings,
        characteristics: calculated
      };

      res.status(200).json(response)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
}