const { MongoClient } = require('mongodb');

async function main() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected successfully to server');

    // for (var i = 1; i <= 5774952; i++) {
    //   await transformReviewModel(client, i)
    //   await transformCharacteristicModel(client, i)
    // }

  } catch(error) {
    console.log(error);
  } finally {
    await client.close();
  }
}
main().catch(console.error)

async function deleteDocs(client) {
  const pipeline = [
    { '$match': { 'product_id': 1000007 } },
    { '$sort': { '_id': -1 } },
    { '$limit': 58 }
  ];
  let aggCursor = await client.db('reviewService').collection('reviews').aggregate(pipeline).map((d) => d.review_id).toArray()

  for (var i = 0; i < aggCursor.length; i++) {
    await client.db('reviewService').collection('reviews').deleteOne({ 'review_id': aggCursor[i] })
  }
}
async function listDatabases(client) {
  const databasesList = await client.db().admin().listDatabases();

  console.log('Databases:');
  databasesList.databases.forEach(db => console.log(`-${db.name}`));
}
async function transformCharacteristicModel(client, id) {

  const pipeline = [
    {
      '$match': {
        'review_id': id
      }
    }, {
      '$lookup': {
        'from': 'characteristics',
        'localField': 'product_id',
        'foreignField': 'product_id',
        'as': 'chars',
        'pipeline': [
          {
            '$lookup': {
              'from': 'characteristic_reviews',
              'let': {
                'character_id': '$id'
              },
              'pipeline': [
                {
                  '$match': {
                    '$expr': {
                      '$eq': [
                        '$characteristic_id', '$$character_id'
                      ]
                    }
                  }
                }, {
                  '$match': {
                    '$expr': {
                      '$eq': [
                        '$review_id', id
                      ]
                    }
                  }
                }, {
                  '$project': {
                    '_id': 0,
                    'id': 0,
                    'review_id': 0
                  }
                }
              ],
              'as': 'charsReview'
            }
          }, {
            '$unwind': '$charsReview'
          }, {
            '$project': {
              '_id': 0,
              'characteristic_id': 0
            }
          }
        ]
      }
    }, {
      '$unwind': {
        'path': '$chars'
      }
    }, {
      '$replaceRoot': {
        'newRoot': {
          '$mergeObjects': [
            {
              'review_id': '$review_id',
              'rating': '$rating',
              'recommend': '$recommend',
              'name': '$name',
              'value': '$charsReview.value'
            }, '$chars'
          ]
        }
      }
    }, {
      '$group': {
        '_id': '$review_id',
        'product_id': {
          '$first': '$product_id'
        },
        'rating': {
          '$first': '$rating'
        },
        'recommended': {
          '$first': '$recommend'
        },
        'characteristics': {
          '$push': {
            'id': '$charsReview.characteristic_id',
            'name': '$name',
            'value': '$charsReview.value'
          }
        }
      }
    }, {
      '$merge': {
        'into': {
          'db': 'reviewService',
          'coll': 'metadata'
        }
      }
    }
  ];

  const aggCursor = client.db('raw-review').collection('reviews').aggregate(pipeline)
  await aggCursor.forEach(doc => console.log(`${doc._id}`));
}
async function transformMetadataModel(client, id) {

  const pipeline = [
    {
      '$match': {
        '_id': id
      }
    }, {
      '$unwind': {
        'path': '$characteristics'
      }
    }, {
      '$addFields': {
        'char_id': '$characteristics.id'
      }
    }, {
      '$project': {
        'characteristics.id': 0
      }
    }, {
      '$addFields': {
        'characteristics': {
          '$concatArrays': [
            [
              {
                'k': {
                  '$toString': '$char_id'
                },
                'v': '$characteristics'
              }
            ]
          ]
        }
      }
    }, {
      '$addFields': {
        'characteristics': {
          '$arrayToObject': '$characteristics'
        }
      }
    }, {
      '$project': {
        'char_id': 0
      }
    }, {
      '$group': {
        '_id': '$_id',
        'product_id': {
          '$first': '$product_id'
        },
        'rating': {
          '$first': '$rating'
        },
        'recommended': {
          '$first': '$recommended'
        },
        'characteristics': {
          '$mergeObjects': '$characteristics'
        }
      }
    }, {
        '$merge': {
          'into': {
            'db': 'reviewService',
            'coll': 'metadataV2'
          }
        }
      }
  ]


  const aggCursor = client.db('reviewService').collection('metadata').aggregate(pipeline)
  await aggCursor.forEach(doc => console.log(`${doc._id}`));
}

async function transformReviewModel(client, id) {

  const pipeline = [
    {
      '$match': {
        'review_id': id
      }
    }, {
      '$lookup': {
        'from': 'photos',
        'localField': 'review_id',
        'foreignField': 'review_id',
        'as': 'photos',
        'pipeline': [
          {
            '$project': {
              '_id': 0,
              'review_id': 0,
              'id': 0
            }
          }
        ]
      }
    }, {
      '$addFields': {
        'reported': {
          '$toBool': '$reported'
        },
        'recommend': {
          '$toBool': '$recommend'
        }
      }
    }, {
      '$merge': {
        'into': {
          'db': 'reviewService',
          'coll': 'reviews'
        }
      }
    }
  ]

  const aggCursor = client.db('raw-review').collection('reviews').aggregate(pipeline);
  await aggCursor.forEach(doc => console.log(`${doc._id}`));
};
