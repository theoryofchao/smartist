const express = require('express');
const router = express.Router();
const knex = require('../knex');
const settings = require('../settings');  //settings.json
const bcrypt = require('bcryptjs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET user logout */
router.get('/logout', (request, response, next) => {
  request.session = null;
  response.status(200).json({'message' : `Logged out`});
});

/* POST user login */
router.post('/login', (request, response, next) => {
  //Checks if user is already logged in
  if(request.session.email) {
    response.end(`Already logged with email ${request.session.email}`);
  }

  //Else does bcrypt comparison
  let email = request.body.email;
  let password = request.body.password;
  knex.select()
      .from(`users`)
      .where(`email`, email)
      .timeout(1000)
      .then( (result) => {
        bcrypt.compare(password, result[0].password, (error, result) => {
          request.session.user_id = result[0].user_id;
          console.log(request.session.email);
          request.session.email = email;
          response.status(200).json({'message' : `Logged In`});
        });
      })
      .catch( (error) => {
        console.error(error);
        response.status.end({'message' : `Login Error`});
      });
});

/* POST user registration */
router.post('/registration', function(request, response, next) {
  let email = request.body.email;
  let password = request.body.password;
  let hash = bcrypt.hashSync(password, email.length);
  let date = new Date(Date.now());
 
  knex('users').insert({ name: email,
                          email: email,
                          handle: email,
                          status: 1,
                          created_at: date,
                          password: hash})
                .timeout(1000)
                .returning(`*`)
                .then( (result) => {
                  request.session.user_id = result[0].user_id;
                  request.session.email = result[0].email;  //TODO: make more secure later
                  response.status(200).json({'message' : `User Inserted`});
                  return;
                })
                .catch( (error) => {
                  console.error(error);
                  response.status(400).json({ 'message': `User already Exists`});
                  return;
                });
});

module.exports = router;
