
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table) {
      table.bigIncrements('user_id');
      table.string('name');
      table.string('email').unique();
      table.string('handle').unique().comment('@Usernames for finding and sharing todos with other users');
      table.integer('status').notNullable().comment('-1: banned, 0: inactive, 1: active, 2: deactivated, 3: deleted');
      table.timestamps();
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users')
  ])
};
