const config = require('app/config')(process.env.NODE_ENV);

module.exports = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: "./yousef_db.sqlite"
        }
    },
    production: {
        client: 'mysql',
        connection: config.db.url || {
            host: config.db.host,
            user: config.db.user,
            password: config.db.password,
            database: config.db.database,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
        },
        seeds: {
            directory: './seeds',
        },
    },
};
