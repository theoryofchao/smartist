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

let knexExactUpdate = (table, where, json, returning) => {
  return knex(table).where(where)
                    .update(json)
                    .returning(returning);
};

router.get('/temp/:search_term', (request, response) => {
  console.log(request.params);
  knex.select('*').from('searches').where('search_term' , 'like', `%${request.params.search_term}%`).then( (result) => {
    response.status(200).json(result);
  });
});


router.get('/temp', (request, response) => {
  console.log(request.params);
  knex.select('*').from('searches').limit(50).then((result) => {
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
  console.log(request.session.user_id, 'user_id');
  if (!request.session.user_id) {
    response.status(403).json({'message': `Unauthorized`});
  }

  //console.log(request.session)

  knex.select()
    .from(`users`)
    .innerJoin('todo', 'users.user_id', "todo.user_id")
    .innerJoin('searches', 'todo.search_id', "searches.search_id")
    .orderBy('todo.created_at', 'desc')
    .timeout(1000)
    .then((result) => {
      //console.log(result);
      return response.json(result);
    })
    .catch((error) => {
      console.error(error);
      return response.end(`Cannot get list items`);
    });
});

/* PUT delete todo (Soft delete) */
router.post('/delete', (request, response, next) => {
  let todo_id = request.body.todo_id;
  //knexExactUpdate(`todo`, {todo_id: todo_id}, {status: -1}, `*`)
  knex('todo').where('todo_id' , todo_id).delete()
    .then( (result) => {
      console.log(result);
      return response.status(200).json({'message' : `Successful Delete`});
    })
    .catch( (error) => {
      console.error(error);
      return response.status(400).json({'message' : `Delete Failed`});
    });
});

/* POST edit user todo */
//TODO: does not bind to a user
//TODO: if a todo_id is specified but that todo does not exist, it will still insert the search but edit nothing
router.post('/edit', (request, response, next) => {
  let search_term = request.body.search_term;
  let category = request.body.category;
  let todo_id = request.body.todo_id;
  let date = new Date(Date.now());

  //Find if the search_id already exists
//  knexExactSearch(`*`, `searches`, { search_term: search_term }, 1)
  knex.select('*').from('searches').where({search_term :search_term, category: category }).limit(1)
    .then( (searchResult) => {
      //If does not exist, create it
      if(searchResult.length == 0) {

        console.log('Create');
        return knexInsert(`searches`, { search_term: search_term, category: category , url : '', created_at : date } , `*`);
      }
      //Return existing search
      else {
        console.log('Existing');
        return searchResult;
      }
    })
    .then( (newReference) => {
      //update the search_id for the todo to the new one
      console.log(newReference[0].search_id);
      return knexExactUpdate(`todo`, { todo_id: todo_id }, { search_id : newReference[0].search_id, updated_at : date }, `*`);
    })
    .then( (changed) => {
      console.log(changed);
      response.status(200).json( {message : "Updated Todo"} );
    })
    .catch( (error) => {
      console.error(error);
      response.status(400).json( {message : "Bad Todo Update"} );
    });
});

/* POST user todo. */
router.post('/', (request, response, next) => {
  let search_term = request.body.search_term;
  let category = request.body.category;
  let date = new Date(Date.now());

  //this needs to be a where that searches for search
  //knexExactSearch(`*`, `searches`, {search_term: search_term}, 1)
  knex.select('*').from('searches').where({search_term :search_term, category: category }).limit(1)
  .then((searchResult) => {
      if (searchResult.length != 0) {
        return knex(`searches`).where({
          search_term: search_term,
          category: category
        }).increment(`counts`, 1).returning(`*`);
      } else {
        return knexInsert(`searches`, {search_term: search_term, category: category, url: '', created_at: date}, `*`);
      }
    })
    .then((searchInsertionResult) => {
      console.log(searchInsertionResult);
      return knexInsert(`todo`, {
        search_id: searchInsertionResult[0].search_id,
        status: 1,
        user_id: 1,
        created_at: date,
        description: ''
      }, `*`);  //TODO: change to session for user_id
    })
    .then((todoInsertionResult) => {
      //console.log(todoInsertionResult);
      response.status(200).json({message: "Search and Todo Insertion Completed"});
    })
    .catch((error) => {
      console.error(error);
    })
});

module.exports = router;
