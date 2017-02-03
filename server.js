// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var pug = require('pug');

//oauth stuff
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var session = require('express-session');
var dotenv = require('dotenv');
var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

//database stuff
var Sequelize = require('sequelize');

//routes
var stocks = require('./stockRoutes');
var loggedIn = require('./loggedInRoutes');

dotenv.load();

app.set('view engine', 'pug');
//app.use(session({ secret: process.env.SESSIONSECRET }));
app.use(flash());

var people =  {
  somePerson: {
    stocks:[
      {
        symbol:'TXN',
        long: 'Texas Instuments Inc.',
        purchased: 'Jan 3, 2017'
      },
    ]
  }
}

//Database setup
var sequelize = new Sequelize('database', process.env.DB_USER, process.env.DB_PASS, {
  host: '0.0.0.0',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
    // Security note: the database is saved to the file `database.sqlite` on the local filesystem. It's deliberately placed in the `.data` directory
    // which doesn't get copied if someone remixes the project.
  storage: '.data/database.sqlite'
});

var strategy = new Auth0Strategy({
    domain:       process.env.AUTH0_DOMAIN,
    clientID:     process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:  process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
  }, 
                                 function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  });

passport.use(strategy);

// you can use this section to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(session({
  secret: 'shhhhhhhhh',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

var env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL
};

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.use('/stocks', stocks);

app.get('/chart', function(req, res){
  res.render('chart')
})

app.get("/login", function (request, response) {
  response.render('login', { env: env });
});

app.get('/logout', function(request, response){
  request.logout();
  response.redirect('/login');
});

app.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }),
  function(req, res) {
    console.log(`${req.user.name.givenName} has logged in`);
    res.redirect(req.session.returnTo || '/');
  });

app.use('/', ensureLoggedIn, loggedIn)

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
