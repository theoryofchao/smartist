var express = require('express');
var router = express.Router();

/* /todo/ */

var database = {};

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.json(database);
});

/* POST user todo. */
router.post('/', (req, res, next) => {
  let name = req.body.name;
  let category = req.body.category;
  let item = {name: name, category: category};
  database.name = item;
  res.send("yay");
});

module.exports = router;
