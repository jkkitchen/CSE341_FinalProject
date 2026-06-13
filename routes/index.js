const express = require("express");
const router = express.Router();
const passport = require('passport');

// Only use routes that exist and work
const bookRouter = require('./bookRoutes');
const patronRouter = require('./patronRoutes');
const locationRouter = require('./locationRoutes');
const copyRouter = require('./copyRoutes');

// Root route
router.get('/', (req, res) => {
    res.send(req.isAuthenticated()
        ? `Logged in as ${req.user.username || req.user.login}`
        : "Logged Out");
});

// Routes for collections
router.use('/books', bookRouter);
router.use('/patrons', patronRouter);
router.use('/locations', locationRouter);
router.use('/copies', copyRouter);

// GitHub Auth Route
router.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/api-docs');
    }
);

// Google Auth Route
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/api-docs');
    }
);

// Logout Route 
router.get('/logout',
    /* #swagger.ignore = true */
    function (req, res, next) {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            req.session.destroy(() => {
                res.redirect('/');
            });
        });
    }
);

// Export
module.exports = router;