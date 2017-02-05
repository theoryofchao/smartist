const express = require('express');
const router = express.Router();
const knex = require('../knex');
const reqApi = require('request');
const amazon = require('amazon-product-api');

/* /api/ */

const client = amazon.createClient({
  awsId: "AKIAISEBN27TRSSVU6FQ",
  awsSecret: "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"
});

const amazonTemplate = function (results){
  let review = '';
  if (results[0].EditorialReviews) {review = results[0].EditorialReviews[0].EditorialReview[0].Content};
  return `<img src=${results[0].MediumImage[0].URL}></img>
          <p>${review}</p>`;
};



//http://webservices.amazon.com/scratchpad/index.html
router.post('/amazon', (request, response) => {
  client.itemSearch({
    Keywords: request.body.title,
    searchIndex: request.body.category,
    responseGroup: 'ItemIds'

  }).then(function (results) {
    console.log(results);

    client.itemLookup({
      idType: 'ASIN',
      itemId: results[0].ASIN[0],
      responseGroup: 'OfferFull,EditorialReview,Images',
      Domain: 'webservices.amazon.com/onca/HTML'



    }).then(function (results) {
      //console.log(amazonTemplate(results));
      response.status(200).send(amazonTemplate(results));
      //response.status(200).json(results);
    }).catch(function (err) {
      console.log(err);
    });
  });
});

module.exports = router;