const { Router } = require('express');
const bodyParser = require('body-parser');
const middlewares = require('app/middlewares');
const forumAuthRoutes = require('app/routes/forum/auth-handler');
const forumPageRoutes = require('app/routes/forum/forum-pages');

const createForumRoutes = ({ db, forumBaseUrl }) => {
    const router = new Router();

    // parse application/x-www-form-urlencoded
    router.use(bodyParser.urlencoded({ extended: false }));

    router.use(bodyParser.json());

    router.use(middlewares.flash);

    router.use(middlewares.setForumBaseUrl(forumBaseUrl));

    router.use(forumAuthRoutes(db, forumBaseUrl));

    router.use(forumPageRoutes(db, middlewares, forumBaseUrl));

    return router;
};

module.exports = createForumRoutes;
