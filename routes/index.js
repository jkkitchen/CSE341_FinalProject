const express = require("express");
const router = express.Router();
const passport = require('passport');

//Routes
const bookRouter = require('./bookRoutes');
const patronRouter = require('./patronRoutes');
const locationRouter = require('./locationRoutes');
const copyRouter = require('./copyRoutes');

// Routes for collections
router.use('/book', bookRouter);
router.use('/patrons', patronRouter);
router.use('/locations', locationRouter);
router.use('/copies', copyRouter);

// Login Route
router.get('/login',
    /* #swagger.ignore = true */
    passport.authenticate('github')
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