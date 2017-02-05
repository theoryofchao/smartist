var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session.user_id);
  res.render('index', { user_id: req.session.user_id });
});

/* GET test page */
router.get('/test', function(req, res, next) {
  res.render('test', { title: 'Test' });
});

module.exports = router;
