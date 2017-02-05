
exports.up = function(knex, Promise) {
  //ALTER TABLE public.searches DROP CONSTRAINT searches_search_term_unique
  return Promise.all([
    knex.schema.table('searches', function(table){
      table.dropUnique('search_term');
    })
  ])
};

exports.down = function(knex, Promise) {
return Promise.all([
    knex.schema.table('searches', function(table){
      table.addUnique('search_term');
    })
  ])
};
