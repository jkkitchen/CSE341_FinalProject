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
                bookID: {
                    type: "string",
                    description: "Book ID (Mongo ObjectId)"
                },
                locationID: {
                    type: "string",
                    ref: "Location ID (Mongo ObjectId)"
                },
                format: String,
                publishingYear: Number,
                ISBN: String,
                checkedIn: Boolean,
                patronID: {
                    type: "string",
                    description: "Patron ID (Mongo ObjectId)"
                }
            }
        }
    */
    isAuthenticated,
    copyValidationRules(),
    validate,
    updateCopy);

//DELETE route to delete a copy
copyRouter.delete('/:id', isAuthenticated, deleteCopy);

module.exports = copyRouter;