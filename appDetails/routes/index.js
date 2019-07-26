const { Router } = require('express');
const createLandingPageRoute = require('app/routes/landing-page');
const createForumRoutes = require('app/routes/forum');

const forumBaseUrl = '/forum';

module.exports = ({ socialLinks, db }) => {

    const router = new Router();

    router.use(createLandingPageRoute({socialLinks}));

    router.use(`${forumBaseUrl}`, createForumRoutes({ db, forumBaseUrl }));

    return router;
};
