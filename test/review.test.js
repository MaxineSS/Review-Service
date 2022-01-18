require('regenerator-runtime/runtime');
const request = require('supertest')('http://localhost:3000')

describe('API', () => {
  describe('POST /reviews', () => {
    test('should respond with a 201 status code when it\'s created', async () => {
      const payload = {
        body: 'This onesie feels soft and good for a cold day. However, was a little too big but overall a good purchase',
        date: new Date(),
        helpfulness: 0,
        photos: ["https://images.unsplash.com/photo-1507920676663-3b72429774ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80"],
        product_id: 1000009,
        rating: 5,
        recommend: true,
        reported: false,
        response: null,
        review_id: 0,
        email: 'happyShopper@mail.com',
        name: 'happyShopper',
        summary: 'best purchase',
        characteristics: { '199845': 2, '199846': 3, '199847': 1, '199848': 4 }
      };
      const res = await request.post('/reviews').send(payload)
      expect(res.statusCode).toBe(201)
      expect(res.created).toBeTruthy()
    })
  })
  describe('GET /reviews', () => {
    test('should return an empty array of results, If no query parameter were provided', async () => {
      await request.get('/reviews').expect(200).then((res) => {
        expect(res.body.results).toHaveLength(0)
      })
    })
    test('should respond with a 200 status code upon successful data retrieval', async () => {
      await request.get('/reviews?product_id=59556').then((res) => {
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('results[0]._id')
        expect(res.body).toHaveProperty('results[0].review_id')
      })
    })
    test('should return a list of reviews with the specified properties', async () => {
      await request.get('/reviews?product_id=59556').then((res) => {
        expect(res.body).toHaveProperty('product', 59556)
        expect(res.body).toHaveProperty('page', 0)
        expect(res.body).toHaveProperty('count', 5)
        expect(res.body).toHaveProperty('results')
      })
    })
  })
  describe('GET /reviews/meta', () => {
    test('should return a metadata with the specified properties for a given product', async () => {
      await request.get('/reviews/meta?product_id=59556').expect(200).then((res) => {
        expect(res.body).toHaveProperty('product_id', 59556)
        expect(res.body).toHaveProperty('ratings')
        expect(res.body).toHaveProperty('recommended')
        expect(res.body).toHaveProperty('characteristics')
        expect(res.body).toHaveProperty('characteristics.Length')
        expect(res.body).toHaveProperty('characteristics.Fit')
        expect(res.body).toHaveProperty('characteristics.Comfort')
        expect(res.body).toHaveProperty('characteristics.Quality')
      })
    })
    test('should return each charcteristic\'s id and average value within characteristics property', async () => {
      await request.get('/reviews/meta?product_id=59556').then((res) => {
        expect(res.body).toHaveProperty('characteristics.Length.id', 198958)
        expect(res.body).toHaveProperty('characteristics.Length.value', 3.125)
        expect(res.body).toHaveProperty('characteristics.Fit.id', 198957)
        expect(res.body).toHaveProperty('characteristics.Fit.value',2.625)
        expect(res.body).toHaveProperty('characteristics.Comfort.id', 198959)
        expect(res.body).toHaveProperty('characteristics.Comfort.value', 3.375)
        expect(res.body).toHaveProperty('characteristics.Quality.id', 198960)
        expect(res.body).toHaveProperty('characteristics.Quality.value', 3)
      })
    })
  })
  describe('PUT /reviews/:review_id/helpful', () => {
    test('should respond with a 200 status code & message upon successful helpfulness count increment', async () => {
      await request.put('/reviews/5774951/helpful').expect(200).then((res) => {
        expect(res.body).toHaveProperty('status', 'Updated')
      })
    })
  })
  describe('PUT /reviews/:review_id/report', () => {
    test('should respond with a 200 status code & message upon successful reporting', async () => {
      await request.put('/reviews/5774951/report').expect(200).then((res) => {
        expect(res.body).toHaveProperty('status', 'Reported')
      })
    })
  })
})


