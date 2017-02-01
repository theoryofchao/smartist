
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('todo', function(table) {
      table.bigIncrements().primary();
      table.string('name').notNullable();
      table.string('description').notNullable();
      table.string('category').notNullable();
      table.integer('status').notNullable().comment('-1: deleted, 0: inactive, 1: active');
      table.bigInteger('user_id').notNullable();
      table.timestamps();
    })
  ]) 
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('todo')
  ])
};
