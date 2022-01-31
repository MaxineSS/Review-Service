let client;
const MetaModel = require('../model/metadata.model.js')
const Helper = require('../helper/collect.meta.js');

module.exports = {
  initializeCache: (redis) => {
    try {
      client = redis
    } catch (e) {
      console.error(e)
    }
  },
  apiGetMetadata: async (req, res) => {
    const product_id = Number(req.query.product_id);

    try {
      client.get(`meta:${product_id}`)
        .then(async (meta) => {
          if (meta) {
            res.status(200).json(JSON.parse(meta))
          } else {
            let metadata = await MetaModel.getMetadata(product_id)
            let collected = Helper.collectMetadata(metadata);
            let calculated = Helper.avgCharacteristic(collected.characteristics);
            let response = {
              product_id: product_id,
              ratings: collected.ratings,
              recommended: collected.ratings,
              characteristics: calculated
            };
            await client.set(`meta:${product_id}`, JSON.stringify(response), { EX: 600, NX: true })
            res.status(200).json(response)
          }
        })
        .catch(e => console.log(e))
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
}