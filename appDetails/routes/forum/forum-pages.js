const { Router } = require('express');
const paginate = require('express-paginate');
const config = require('app/config')(process.env.NODE_ENV);

module.exports = (db, middlewares, forumBaseUrl) => {

    const router = new Router();

    const authGuard = middlewares.auth(forumBaseUrl);

    const QuestionModel = db.model('Question');
    const UserModel = db.model('User');


    router.get('/', function(req, res) {

        const currentPage = req.query.page || 1;

        return QuestionModel.fetchPage({pageSize: config.pageLimit, page: currentPage, withRelated: ['user']})
            .then(questions => {

                const pagination = {...questions.pagination};

                return res.render('forum-index', {
                    questions: questions.toJSON(),
                    pages: paginate.getArrayPages(req)(config.pageLimit, pagination.pageCount, currentPage)
                });

            }).catch(err => {
                console.log(err);
                return res.render('forum-index');
            });
    });

    router.get('/login', function(req, res) {
        return res.render('forum-login');
    });

    router.get('/register', function(req, res) {
        return res.render('forum-register');
    });

    router.get('/profile', authGuard, (req,res) => {

        console.log(req.user);

        return UserModel.where({id: req.user.id}).fetch({withRelated: ['questions']})
            .then(user => {

                return res.render('forum-profile', {profile: user.toJSON()});

            }).catch(err => {

                return res.render('forum-profile');
            });

    });

    router.get('/ask-question', (req, res) => res.render('forum-ask-question'));

    router.post('/create-question', authGuard, (req, res) => {

        const {title, description} = req.body;

        if(!title || !description) {
            req.flash.error('Both fields are required!');
            return res.redirect('back');
        }

        return QuestionModel.forge({
            title,
            description,
            user_id: req.user.id
        }).save().then((question) => {
            const { id } = question.toJSON();

            return res.redirect(`${forumBaseUrl}/view-question/${id}`);
        }).catch(err => {
            //Error saving image to database
            console.log('Error saving question to database:: %s', err.message);
            return res.redirect('back');
        });
    });

    router.get('/view-question/:questionId', (req, res) => {
        const questionId = req.params.questionId;

        return QuestionModel .where({id: questionId}).fetch({withRelated: ['user']})
            .then(question => {

                res.render('forum-single-question', { question: question.toJSON() });

            }).catch(err => {

                console.log('Unable to fetch question data:: %s', err.message);

                res.redirect('back');
            });
    });

    router.get('/tags', (req, res) => res.render('forum-tags'));

    router.get('/logout', (req, res) => {
        console.log("LOGGING OUT " + req.user.username);
        req.logout();
        res.redirect(forumBaseUrl);
    });

    return router;
};
