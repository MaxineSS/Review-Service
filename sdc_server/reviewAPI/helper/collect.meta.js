module.exports = {
  collectMetadata: (docs) => {
    const result = {
      ratings: {},
      recommended: {},
      characteristics: {}
    };
    for (let i = 0; i < docs.length; i++) {
      let doc = docs[i];
      doc['characteristics'].forEach(c => {
        if (result['characteristics'][c.name] === undefined) {
          result['characteristics'][c.name] = {};
          result['characteristics'][c.name][c.value] = 1;
          result['characteristics'][c.name]['id'] = c.id;
        } else {
          if (result['characteristics'][c.name][c.value] === undefined) {
            result['characteristics'][c.name][c.value] = 1;
          } else {
            result['characteristics'][c.name][c.value]++;
          }
        }
      })

      let rating = docs[i].rating
      let recommended = docs[i].recommended;
      let characteristic = docs[i].characteristic;

      if (result['ratings'][rating] === undefined) {
        result['ratings'][rating] = 1;
      } else {
        result['ratings'][rating]++;
      }
      if (result['recommended'][recommended] === undefined) {
        result['recommended'][recommended] = 1;
      } else {
        result['recommended'][recommended]++;
      }
    }
    return result;
  },
  avgCharacteristic: (obj) => {
    let sum;
    let count;
    let avg;
    for (const prop in obj) {
       sum = 0;
       count = 0;
       avg = 0;
       for (const [key, value] of Object.entries(obj[prop])) {
           if(key === 'id') {
            continue;
           } else {
             sum += (Number(key) * value);
             count += value
           }
       }
       avg = sum / count;
       obj[prop]['value'] = avg;
    }
    return obj;
  }
}