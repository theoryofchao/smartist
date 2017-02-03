
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('searches', function(table) {
      table.increments('search_id').primary();
      table.string('search_term').unique().notNullable();
      table.string('category').notNullable();
      table.integer('counts').defaultsTo(1);
      table.string('url');
      table.timestamps();
    })
  ])  
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('searches')
  ])
};
