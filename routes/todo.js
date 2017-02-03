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

router.get('/temp/:search_term', (request, response) => {
  console.log(request.params);
  knex.select('*').from('searches').where('search_term' , 'like', `%${request.params.search_term}%`).then( (result) => {
    response.status(200).json(result);
  });
});


router.get('/temp', (request, response) => {
  console.log(request.params);
  knex.select('*').from('searches').then((result) => {
    response.status(200).json(result);
  });
});



/* GET todos by LIKE search_term */
router.get('/search_term/:search_term', (request, response, next) => {
  knex.select(`*`)
      .from(`searches`)
      .innerJoin(`searches`, `todo.search_id`, `searches.search_id`)
      .where(`searches.search_term`, `like`,  `%${request.params.search_term}%`)
      .timeout(1000)
      .then( (result) => {
        response.status(200).json(result);
      });
});

/* GET todos by ID */
router.get('/id/:todo_id', (request, response, next) => {
  knexExactSearch(`*`, `todo`, {todo_id : request.params.todo_id}, 1)
    .then( (result) => {
      response.status(200).json(result[0]);
    })
    .catch( (error) => {
      console.error(error);
    });
});

/* GET users todos. */
router.get('/', (request, response, next) => {
  if(!request.session) {
    response.status(403).json({ 'message' : `Unauthorized` });
  }

  let search_term = request.body.search_term ? request.body.search_term : '';

  knex.select()
      .from(`searches`)
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
      return knex(`searches`).where({ search_term: search_term, category: category}).increment(`counts`, 1).returning(`*`);
    } else {
      return knexInsert(`searches`, { search_term : search_term, category : category, url : '', created_at : date } , `*`);
    }
  })
  .then( (searchInsertionResult) => {
    console.log(searchInsertionResult);
    return knexInsert(`todo`, { search_id : searchInsertionResult[0].search_id, status : 1, user_id : 1, created_at : date, description: '' }, `*`);  //TODO: change to session for user_id
  })
  .then( (todoInsertionResult) => {
    console.log(todoInsertionResult);
    response.status(200).json({message : "Search and Todo Insertion Completed"});
  })
  .catch( (error) => {
    console.error(error);
  })
});

module.exports = router;
