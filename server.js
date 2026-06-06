//Dependencies
require('dotenv').config();
const express = require('express');
const { connectDB } = require('./db/connect');
const app = express();
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
//From other files
const Patron = require('./models/Patron');
const indexRouter = require('./routes/index');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');


//Get port from .env file
const port = process.env.PORT || 3000;

//FOR RENDER AND PASSPORTAUTH/SESSIONS
app.set('trust proxy', 1); //helps OAuth to not randomly fail

//MIDDLEWARE: MUST PUT THIS BEFORE ROUTES OR POST WILL NOT WORK
app
    //Rather than using bodyParser, use express.json to do the same thing
    .use(express.json())
    .use(express.urlencoded({ extended: true })) //tells Express to parse incoming form data so it can be accessed in req.body
    //EXPRESS SESSION
    .use(session({
        secret: "secret",
        resave: false,
        saveUninitialized: true
    }))
    //PASSPORT
    .use(passport.initialize())
    .use(passport.session())
    //CORS (allows frontend and backend to run on different ports, acts as a security boundary)
    .use(cors())
    

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            //Look for existing user and create entry if they don't exist--prevents duplicates in patron collection on MongoDB
            const user = await Patron.findOneAndUpdate(
                { //Search parameters
                    provider: 'github',
                    providerId: profile.id
                },
                { //Update entry with these values (should be the same most of the time)
                    provider: 'github',
                    providerId: profile.id,
                    username: profile.username,
                    email: profile.emails?.[0]?.value || null //GitHub may not have email so store null if not found
                },
                { //
                    new: true, //Return updated patron info
                    upsert: true, //Creates new entry in patron collection if patron not found
                    setDefaultsOnInsert: true //If a new patron if created, apply schema defaults
                }
            );

            //Return database user
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
passport.deserializeUser(async (id, done) => {  //deserializeUser is designed to accept a callback so Passport doesn't need it to be async to work as long as we call done() in this function.
    try {
        const user = await Patron.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
   }
});

app.get('/',
    /* #swagger.ignore = true */
    (req, res) => {
    res.send(req.user //condition
        ? `Logged in as ${req.user.username || req.user.login}` //if true
        : "Logged Out") //if false
});

app.get('/github/callback',
    /* #swagger.ignore = true */
    passport.authenticate('github', {
        failureRedirect: '/api-docs'
    }),
    (req, res) => {        
        res.redirect('/');
    }
);


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
        //Connect to database
        await connectDB();
        //Start server on port listed in .env file
        app.listen(port, () => console.log(`Database listening and server running on port ${port}`));

    } catch (err) {
        console.error(err);
    }
}

startServer();