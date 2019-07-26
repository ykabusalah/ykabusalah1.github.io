const {Router} = require('express');
const bcrypt = require('bcrypt-nodejs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Generates hash using bcrypt
const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);

// Validates a hash against a provided value
const validatePassword = (password, hash) => bcrypt.compareSync(password, hash);

module.exports = (db, forumBaseUrl) => {
    const router = new Router();
    const UserModel = db.model('User');

    // configure how passport looks for a user
    passport.use(new LocalStrategy(
        (username, password, done) => UserModel.where({username: username}).fetch().then(user => {

            if (!user) {
                return done(null, false, {message: 'Incorrect username.'});
            }

            // check if password matches what is in the database
            if (!validatePassword(password, (user.toJSON()).password)) {
                return done(null, false, {message: 'Incorrect password.'});
            }

            return done(null, user);

        }).catch(err => {
            return done(err);
        })
    ));

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => UserModel.where({id: id}).fetch()
        .then(user => {

            if (!user) {
                return done(null, false);
            }

            user = user.toJSON();

            // remove the user's password
            delete user.password;

            return done(null, user);
        })
        .catch(err => done(err, null)));


    router.post('/create-account', (req, res) => {

        // Do save user profile.hbs action here
        const newUser = {
            full_name: req.body.full_name,
            username: req.body.username,
            password: createHash(req.body.password),
            email: req.body.email
        };

        return UserModel.forge(newUser).save().then(() => {

            console.log('User successfully created');
            return res.redirect(`${forumBaseUrl}/login`);

        }).catch(err => {

            if (err.code === 'ER_DUP_ENTRY') {
                // username exists already
            }

            console.log(err);

            res.redirect('back');
        });

    });

    router.post('/login',
        passport.authenticate('local', {
            successRedirect: forumBaseUrl,
            failureRedirect: `${forumBaseUrl}/login`,
            failureFlash: true
        })
    );

    return router;
};
