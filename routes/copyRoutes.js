const express = require("express");
const copyRouter = express.Router();
const {
    getAllCopies,
    getSingleCopy,
    createCopy,
    updateCopy,
    deleteCopy
} = require('../controllers/copyController');
const { copyValidationRules, validate } = require('../middleware/validate');
const { isAuthenticated } = require("../middleware/authenticate");
const { isAdmin } = require("../middleware/authorize");

//GET route for all copies
copyRouter.get('/',
    isAuthenticated, //the controller for this route uses req.user to check user role, must be logged in
    getAllCopies);

//GET route for single copy
copyRouter.get('/:id',
    isAuthenticated, //the controller for this route uses req.user to check user role, must be logged in
    getSingleCopy);

//POST route to create new copy
copyRouter.post(
    '/',
    isAuthenticated,
    isAdmin, //must have admin status to make changes
    copyValidationRules(),
    validate,
    createCopy);

//PUT route to update a copy
copyRouter.put('/:id',
    /* To ensure that the PUT route in api-docs has a body space for updates
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Updated copy information',
            required: true,
            schema: {
                bookID: "",
                locationID: "",
                format: "",
                publishingYear: "",
                ISBN: "",
                checkedIn: "",
                patronID: ""
            }
        }
    */
    isAuthenticated,
    isAdmin, //must have admin status to make changes
    copyValidationRules(),
    validate,
    updateCopy);

//DELETE route to delete a copy
copyRouter.delete('/:id',
    isAuthenticated,
    isAdmin, //must have admin status to make changes
    deleteCopy);

module.exports = copyRouter;