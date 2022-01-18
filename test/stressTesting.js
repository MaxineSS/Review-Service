import http from 'k6/http';
import { sleep, check } from 'k6';

// export const options = {
//   stages: [
//     { duration: '25s', target: 1 }, // base lline
//     { duration: '60s', target: 1 },
//     { duration: '25s', target: 10 }, // below normal load
//     { duration: '60s', target: 10 },
//     { duration: '25s', target: 100 }, // normal load
//     { duration: '60s', target: 100 },
//     { duration: '25s', target: 1000 }, // around the breaking point
//     { duration: '60s', target: 1000 },
//     { duration: '60s', target: 0 }, // scale down. Recovery stage.
//   ],
//   // thresholds: {
//   //   http_req_duration: ['p(95) < 2000'], // 95% of requests should be below 2.0s(2000ms)
//   //   http_req_failed: ['rate < 1'] // http errors should be less than 1%
//   // }
// };

export const options = {
  stages: [
    { duration: '25s', target: 10 },
    { duration: '60s', target: 10 },
    { duration: '25s', target: 100 },
    { duration: '60s', target: 100 },
    { duration: '25s', target: 1000 },
    { duration: '60s', target: 1000 },
    { duration: '60s', target: 0 },
  ]
}
export default function () {
  http.get('http://localhost:3000/reviews/meta?product_id=885685');
  sleep(1)
}


// export const options = {
//   vus: 600,
//   duration: '30s',
// }

// export default function () {
//   const before = new Date().getTime();
//   const T = 6;

  // http.get('http://localhost:3000/reviews/meta?product_id=885686');

//   const after = new Date().getTime();
//   const diff = (after - before) / 1000;
//   const remainder = T - diff;
//   check(remainder, { 'reached request rate': remainder > 0 });
//   if (remainder > 0) {
//     sleep(remainder);
//   } else {
//     console.warn(`Timer exhausted! The execution time of the test took longer than ${T} seconds`);
//   }
// }

// export default function () {
//   const BASE_URL = 'http://localhost:3000/reviews';

//   http.batch([
//     ['GET', `${BASE_URL}?product_id=988940`],
//     ['GET', `${BASE_URL}?product_id=978940`],
//     ['GET', `${BASE_URL}?product_id=995941`],
//     ['GET', `${BASE_URL}?product_id=996942`],
//     ['GET', `${BASE_URL}?product_id=968344`]
//   ])
//   sleep(1);
// }

