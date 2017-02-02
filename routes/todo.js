const express = require('express');
const router = express.Router();
const knex = require('../knex');

/* /todo/ */


/* GET users todos. */
router.get('/', (req, res, next) => {
  knex.select()
      .from(`todo`)
      .timeout(1000)
      .then( (result) => {
        console.log(result);
        return res.json(result);
      })
      .then( (error) => {
        console.error(error);
        return res.end(`Cannot get list items`);
      });
});

/* POST user todo. */
router.post('/', (req, res, next) => {
  let name = req.body.name;
  let category = req.body.category;
  let date = new Date(Date.now());

  knex('todo').insert({ name: name,
                        description: name,
                        category: category,
                        status: 1,
                        user_id: 2,
                        created_at: date })
              .timeout(1000)
              .then( (result) => {
                return res.end(`Todo Added`);
              })
              .then( (error) => {
                return res.end(`Todo Failed`);
              });
});

module.exports = router;
