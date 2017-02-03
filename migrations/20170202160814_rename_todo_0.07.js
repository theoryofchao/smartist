
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('todo', function(table) {
      table.dropColumn('name');
      table.bigInteger('search_id').notNullable();
      table.foreign('search_id').references('searches.search_id');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('todo', function(table) {
      table.dropColumn('search_id');
      table.string('name').notNullable();
    })
  ])
};
