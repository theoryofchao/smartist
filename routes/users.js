const express = require('express');
const router = express.Router();
const knex = require('../knex');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/registration', function(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  let date = new Date(Date.now());

  knex('users').insert({ name: email,
                          email: email,
                          handle: email,
                          status: 1,
                          created_at: date,
                          password: password})
                .timeout(1000)
                .then( (result) => {
                  return res.end(`user inserted`);
                })
                .then( (error) => {
                  return res.end(`user registration error`);
                });
});

module.exports = router;
