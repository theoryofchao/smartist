
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('todo', function(table){
      table.dropColumn('category');
    })
  ])  
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('todo', function(table) {
      table.string('category').notNullable();
    })
  ])
};
