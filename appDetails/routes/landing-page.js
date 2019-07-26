const { Router } = require('express');

const createLandingPageRoute = ({ socialLinks }) => {

    const router = new Router();

    router.get('/', (req, res) => {
        res.render('landing-page', { layout: false, socialLinks });
    });

    return router;
};

module.exports = createLandingPageRoute;
