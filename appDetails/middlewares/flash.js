module.exports = (req, res, next) => {
    res.locals.success_msg  = req.flash('success_msg');
    res.locals.error_msg    = req.flash('error_msg');
    res.locals.error        = req.flash('error'); // Passport error message
    res.locals.user         = req.user || null;
    return next();
};
