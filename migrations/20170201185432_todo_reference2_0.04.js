
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('todo', function(table) {
      table.foreign('user_id').references('users.user_id');
    })
  ])  
};

exports.down = function(knex, Promise) {
  return Promise.all([
    table.schema.table('todo', function(table) {
      table.dropForeign('user_id');       
    })
  ])
};
