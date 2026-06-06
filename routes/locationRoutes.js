const express = require("express");
const locationRouter = express.Router();
const {
    getAllLocations,
    getSingleLocation,
    createLocation,
    updateLocation,
    deleteLocation
} = require('../controllers/locationController');
const { locationValidationRules, validate } = require('../middleware/validate');
const { isAuthenticated } = require("../middleware/authenticate");
const { isAdmin } = require("../middleware/authorize");

//GET route for all locations
locationRouter.get('/', getAllLocations);

//GET route for single location
locationRouter.get('/:id', getSingleLocation);

//POST route to create new location entry
locationRouter.post(
    '/',
    isAuthenticated,
    isAdmin, //must have admin status to make changes
    locationValidationRules(),
    validate,
    createLocation);

//PUT route to update a location entry
locationRouter.put('/:id',
    /* To ensure that the PUT route in api-docs has a body space for updates
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Updated location information',
            required: true,
            schema: {
                name: 'any',
                address: 'any'
            }
        }
    */
    isAuthenticated,
    isAdmin, //must have admin status to make changes
    locationValidationRules(),
    validate,
    updateLocation);

//DELETE route to delete a location entry
locationRouter.delete('/:id',
    isAuthenticated,
    isAdmin, //must have admin status to make changes
    deleteLocation);

module.exports = locationRouter;