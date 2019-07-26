const config = require('app/config')(process.env.NODE_ENV);
const path = require('path');
const express = require('express');
const paginate = require('express-paginate');
const exphbs  = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const passport          = require('passport');
const handlebars = require('handlebars');
const MomentHandler     = require("handlebars.moment");
const createRoutes = require('app/routes');

const app = express();

// include connection to database
const dbSetup = require('app/config/bookshelf')(config.env);

// Moment Configuration -- For dates
MomentHandler.registerHelpers(handlebars);

require('app/libs/handlebars-helpers')(handlebars);

// configure session for app
app.use(session({
   secret: config.sessionStoreSecret,
   saveUninitialized : false,
   resave            : false,
   cookie: {
      maxAge: 120 * 60 * 1000 // 2 hours for testing
   },
   store: dbSetup.store
}));

// Passport initialize
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// view engine setup
app.engine('hbs', exphbs({
   extname:".hbs",
   defaultLayout: 'main',
   layoutsDir: __dirname + '/app/views/layouts/',
   partialsDir: __dirname + '/app/views/partials/'
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'app/views'));

app.use(paginate.middleware(config.pageLimit, config.pageLimit));

app.use(express.static(path.join(__dirname, 'public')));

app.use(createRoutes({ socialLinks: config.socialLinks, db: dbSetup.bookshelf }));

app.listen(config.port, () => {
   console.log(`App is running on port ${ config.port }`);
});
