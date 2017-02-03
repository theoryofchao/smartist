
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('todo', function (table) {
      table.renameColumn('id', 'todo_id');  
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('todo', function (table) {
      table.renameColumn('todo_id', 'id');
    })
  ])
};
