module.exports = (forumBaseUrl) => (req, res, next) => {
    res.locals.forumBaseUrl = forumBaseUrl;
    return next();
};
