'use strict';

exports.up = (knex, Promise) => Promise.all([
    knex.schema
        .table('users', (table) => {
            table.string('email').unique();
        }),
]);

exports.down = (knex, Promise) => Promise.all([
    knex.schema
        .table('users', (table) => {
            table.dropColumn('email');
        }),
]);
