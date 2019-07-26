module.exports = forumBaseUrl => (req, res, next) => {

    if(req.user) {
        res.locals.user = req.user;
        return next();
    }

    return res.redirect(`${forumBaseUrl}/login`);
};
