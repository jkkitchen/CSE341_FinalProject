const express = require("express");
const patronRouter = express.Router();
const {
    getAllPatrons,
    getSinglePatron,
    deletePatron
} = require('../controllers/patronController');
const { isAuthenticated } = require("../middleware/authenticate");
const { isAdmin } = require("../middleware/authorize");

//GET route for all patrons
patronRouter.get('/',
    isAuthenticated,
    isAdmin,
    getAllPatrons);

//GET route for single patron
patronRouter.get('/:id',
    isAuthenticated,
    isAdmin,
    getSinglePatron);

//DELETE route to delete a patron entry
patronRouter.delete('/:id',
    isAuthenticated,
    isAdmin,
    deletePatron);

module.exports = patronRouter;