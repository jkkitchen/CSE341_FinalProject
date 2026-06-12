const express = require("express");
const router = express.Router();
const passport = require('passport');

// Only use routes that exist and work
const bookRouter = require('./bookRoutes');
const patronRouter = require('./patronRoutes');
const locationRouter = require('./locationRoutes');
const copyRouter = require('./copyRoutes');

// Routes for collections
router.use('/books', bookRouter);
router.use('/patrons', patronRouter);
router.use('/locations', locationRouter);
router.use('/copies', copyRouter);

// Logout Route (keep this one)
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