'use strict';

const config = {

    //development config values here
    development: {
        db: {},
    },

    //production config values here
    production: {
        db: {
            host: process.env.MYSQL_HOST || 'http://localhost',
            port: process.env.MYSQL_PORT,
            database: process.env.MYSQL_DATABASE || 'yousef_db',
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || '',
            url: process.env.JAWSDB_URL
        },
    },

    //config that remain the same regardless of app environment
    general: {
        port: process.env.PORT || 5000, //so that our hosting environment might supply its own port
        sessionStoreSecret: process.env.SESSION_STORE_SECRET || 'secret',
        token: {
            secret: process.env.TOKEN_SECRET,
            expirationDays: process.env.TOKEN_EXPIRATION_DAYS
        },
        logger: {
            name: process.env.LOGGER_NAME
        },
        socialLinks: [
            {
                link: '/forum',
                name: 'forum'
            },
            {
                link: '#',
                name: 'facebook'
            }, {
                link: '#',
                name: 'github'
            }, {
                link: '#',
                name: 'linkedIn'
            },
        ],
        pageLimit: 10
    }
};

module.exports = (env) => {

    if (typeof env === 'undefined') {
        env = 'development';
    }

    return Object.assign({ env }, config[env], config.general);
};
