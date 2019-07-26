/**
 * Creates database connection for entire application
 */

const fs = require('fs');
const path = require('path');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const knexFile = require('knexfile');

const PATH_TO_MODELS = 'app/db-models';

module.exports = (env) => {
    const knex = require('knex')(knexFile[env]);
    const bookshelf = require('bookshelf')(knex);

    // Initialize application session
    const store = new KnexSessionStore({
        knex: knex,
        tablename: 'sessions' // optional. Defaults to 'sessions'
    });

    // Initialize bookshelf plugins
    bookshelf.plugin('registry');
    bookshelf.plugin('visibility');
    bookshelf.plugin('pagination');

    fs.readdirSync(PATH_TO_MODELS).forEach((file) => {
        const model = require(path.join(PATH_TO_MODELS, file));
        // Hydrate models with bookshelf
        model(bookshelf);
    });

    return {
        bookshelf,
        store
    };
};
