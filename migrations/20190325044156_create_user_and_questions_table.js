exports.up = (knex, Promise) => Promise.all([
    knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('username', 45).unique();
        table.string('password');
        table.string('full_name', 500).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    }),

    knex.schema.createTable('questions', (table) => {
        table.increments('id').primary();
        table.string('title', 140).notNullable();
        table.string('description', 500).notNullable();
        table.integer('user_id').unsigned().notNullable().references('users.id');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    }),
]);

exports.down = (knex, Promise) => Promise.all([
    knex.schema.dropTable('users'),
    knex.schema.dropTable('questions'),
]);
