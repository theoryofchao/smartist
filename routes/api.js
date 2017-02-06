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

const youtubeTemplate = function (videoId){
  console.log(videoId);
  return  `<iframe id="ytplayer" allowfullscreen="allowfullscreen" type="text/html" width="320" height="180"
            src="https://www.youtube.com/embed/${videoId}"
               frameborder="0"></iframe>`
};


//http://webservices.amazon.com/scratchpad/index.html
router.post('/amazon', (request, response) => {
  let searchIndex = "";
  console.log(request.body.title);
  if (request.body.category === "book") {request.body.category = "Books"};
  if (request.body.category === "movie") {request.body.category = "Movies"};
  if (request.body.category === 'product' || request.body.category === 'resturant') {searchIndex = 'All'} else {searchIndex = request.body.category};

  client.itemSearch({
    Keywords: request.body.title,
    searchIndex: searchIndex,
    responseGroup: 'ItemIds'

  }).then(function (results) {
    console.log(results, "results");

    client.itemLookup({
      idType: 'ASIN',
      itemId: results[0].ASIN[0],
      responseGroup: 'OfferFull,EditorialReview,Images',

    }).then(function (results) {
      //console.log(amazonTemplate(results));
      let retValue =  (amazonTemplate(results));
      if (request.body.category === 'Movies') {
        let youTube = reqApi.get('http://127.0.0.1:3000/api/youtube/' + request.body.title + "movie%20trailer" , function (error, res, body) {
         return response.status(200).send(retValue + res.body);
        });
      } else {

        return response.status(200).send(retValue);
      }
    }).catch(function (err) {
      console.log(err);
    });
  });
});



router.get('/youtube/:id', (request, response) => {
  options = {
    url: `https://www.googleapis.com/youtube/v3/search?part=id&q=${request.params.id}&key=AIzaSyBaDb1wlcW9WXDPpRzPanZr58lhtl1UnIo`
  };
  //send request
  reqApi(options, function (error, response, body) {
  }).on('complete' , function(result){
    let parsed = JSON.parse(result.body).items[0].id.videoId;
    response.status(200).send(youtubeTemplate(parsed));
  });
});

module.exports = router;