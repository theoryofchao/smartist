const express = require('express');
const router = express.Router();
const knex = require('../knex');

/* /todo/ */

let knexExactSearch = (select , table , where, limit) => {
  return knex.select(select)
      .from(table)
      .where(where)
      .limit(limit)
      .timeout(1000)
      .returning(`*`)
      .timeout(1000);
};

let knexInsert = (table, json, returning) => {
  return knex(table).insert(json)
                    .returning(returning)
                    .timeout(1000);
};

/* GET users todos. */
router.get('/', (request, response, next) => {
  if(!request.session) {
    response.status(403).json({ 'message' : `Unauthorized` });
  }

  let search_term = request.body.search_term ? request.body.search_term : '';

  knex.select()
      .from(`todo`)
      .timeout(1000)
      .then( (result) => {
        console.log(result);
        return response.json(result);
      })
      .catch( (error) => {
        console.error(error);
        return response.end(`Cannot get list items`);
      });
});

/* POST user todo. */
router.post('/', (request, response, next) => {
  let search_term = request.body.search_term;
  let category = request.body.category;
  let date = new Date(Date.now());

  knexExactSearch(`*`, `searches`, { search_term: search_term }, 1)
    .then( (searchResult) => {
      if(searchResult.length != 0) {
        console.log(searchResult); //TODO update count
      }
      else {
        return knexInsert(`searches`, { search_term : search_term, category : category, url : '', created_at : date } , `*`);
      }
    })
    .then( (searchInsertionResult) => {
      console.log(searchInsertionResult);
      return knexInsert(`todo`, { search_id : searchInsertionResult[0].search_id, status : 1, user_id : 1, created_at : date, description: '' }, `*`);  //TODO: change to coookie session once things stabilized
    })
    .then( (todoInsertionResult) => {
      console.log(todoInsertionResult);
      response.status(200).json({message : "Search and Todo Insertion Completed"});
    })
    .catch( (error) => {
      console.error(error);
    })
  });
  
  //console.log(result);


  /*knex('searches').insert( {search_term : search_term,
                            category    : category,
                            url         : '' ,
                            created_at  : date })
                  .returning('*')
                  .timeout(1000)
                  .then((result) => {
                    response.send('yay');
                    return;
                  })
                  .catch( (error) => {
                    console.error(error);
                    response.status(400).send('fuck you');
                  });*/
  



  /*knex('todo').insert({ name: name,
                        description: name,
                        category: category,
                        status: 1,
                        user_id: 1, 
                        created_at: date })
              .timeout(1000)
              .then( (result) => {
                return response.end(`Todo Added`);
              })
              .catch( (error) => {
                return response.status(400).json(`Todo Failed`);
              });*/

module.exports = router;
