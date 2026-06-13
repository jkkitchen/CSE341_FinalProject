//Dependencies
require('dotenv').config();
const express = require('express');
const { connectDB } = require('./db/connect');
const app = express();
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
//From other files
const Patron = require('./models/Patron');
const indexRouter = require('./routes/index');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');


//Get port from .env file
const port = process.env.PORT || 3000;

//FOR RENDER AND PASSPORTAUTH/SESSIONS
app.set('trust proxy', 1);

//MIDDLEWARE: MUST PUT THIS BEFORE ROUTES OR POST WILL NOT WORK
app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(session({
        secret: "secret",
        resave: false,
        saveUninitialized: true
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use(cors())
    

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await Patron.findOne({
                provider: 'github',
                providerId: profile.id
            });

            if (!user) {
                user = await Patron.create({
                    provider: 'github',
                    providerId: profile.id,
                    username: profile.username,
                    email: profile.emails?.[0]?.value || null
                })
            }
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }
));

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    console.log('Google OAuth callback received for user:', profile.displayName);
    try {
      let user = await Patron.findOne({
        provider: 'google',
        providerId: profile.id
      });

      if (!user) {
        user = await Patron.create({
          provider: 'google',
          providerId: profile.id,
          username: profile.displayName,
          email: profile.emails?.[0]?.value || null
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

//Store login info
passport.serializeUser((user, done) => {
    done(null, user._id);
});

//Restore user on requests
passport.deserializeUser(async (id, done) => {
    try {
        const user = await Patron.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
   }
});

//ROUTES
app.use('/', indexRouter);

//SWAGGER: API DOCUMENTATION
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//ERRORS
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

//CONNECT TO DB AND START SERVER
const startServer = async () => {
    try {
        await connectDB();

        const server = app.listen(port, () =>
            console.log(`Database listening and server running on port ${port}`)
        );

        return server;
    } catch (err) {
        console.error(err);
    }
};

//Set up for testing--it can be imported into Jest without starting a second listener
if (require.main === module) {
    startServer();
}

//Export app for Jest
module.exports = app;