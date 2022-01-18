import http from 'k6/http';

// export const options = {
//   scenarios: {
//     constant_request_rate: {
//       executor: 'constant-arrival-rate',
//       rate: 1000,
//       timeUnit: '1s',
//       duration: '30s',
//       preAllocatedVUs: 250,
//       maxVUs: 300,
//     },
//   },
// };

// export const options = {
//   scenarios: {
//     constant_request_rate: {
//       executor: 'constant-arrival-rate',
//       rate: 100,
//       timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
//       duration: '1m',
//       preAllocatedVUs: 200, // how large the initial pool of VUs would be
//       maxVUs: 300, // if the preAllocatedVUs are not enough, we can initialize more
//     },
//   },
// };

// export const options = {
//   scenarios: {
//     constant_request_rate: {
//       executor: 'constant-arrival-rate',
//       rate: 10,
//       timeUnit: '1s',
//       duration: '1m',
//       preAllocatedVUs: 20,
//       maxVUs: 100,
//     },
//   },
// };
// export const options = {
//   scenarios: {
//     constant_request_rate: {
//       executor: 'constant-arrival-rate',
//       rate: 1,
//       timeUnit: '1s',
//       duration: '1m',
//       preAllocatedVUs: 20,
//       maxVUs: 100,
//     },
//   },
// };

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s',
      duration: '60s',
      preAllocatedVUs: 250,
      maxVUs: 500,
    },
  },
};

// GET METADATA
export default function () {
  http.put('http://localhost:3000/reviews/5778951/report');
}

// GET REVIEWS
// export default function () {
//   http.get('http://localhost:3000/reviews/meta?product_id=714879');
// }

// POST REVIEW
// export default function () {
//   const url = 'http://localhost:3000/reviews?product_id=935421';
//   let payload = {
//     product_id: 935421,
//     name: 'K6POSTtest800',
//     email: 'happyShopper@mail.com',
//     recommend: true,
//     summary: 'best purchase',
//     body: 'This onesie feels soft and good for a cold day. However, was a little too big but overall a good purchase',
//     rating: 2,
//     photos: ['this is test url://hot'],
//     characteristics: { '3131271': 1, '3131268': 5, '3131269': 2, '3131270': 4 }
//   }
//   http.post(url, JSON.stringify(payload), {headers: { 'Content-Type': 'application/json' }})
// };







// // UPDATE HELPFUL
// export default function () {
//   http.get('http://localhost:3000/reviews/4127403/helpful');
// }
// // UPDATE REPORT
// export default function () {
//   http.get('http://localhost:3000/reviews/4127403/report');
// }
