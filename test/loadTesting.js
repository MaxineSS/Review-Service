import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '30s',
}

// export default function () {
//   http.get('http://localhost:3000/reviews?product_id=595562');
//   sleep(1);
// };

export default function () {
  const url = 'http://localhost:3000/reviews?product_id=885686';
  let payload = {
    product_id: 885686,
    name: 'posttest',
    email: 'happyShopper@mail.com',
    recommend: true,
    summary: 'best purchase',
    body: 'This onesie feels soft and good for a cold day. However, was a little too big but overall a good purchase',
    rating: 2,
    photos: ['this is test url://hot'],
    characteristics: { '3299897': 2, '3299898': 3, '3299899': 1, '3299900': 4 }
  }
  http.post(url, payload, { headers: { 'Content-Type': 'x-www-form-urlencoded' } })
  sleep(2)
};