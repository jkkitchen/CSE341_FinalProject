const express = require("express");
const bookRouter = express.Router();
const {
    getAllBooks,
    getSingleBook,
    createBook,
    updateBook,
    deleteBook
} = require('../controllers/bookController');
const { bookValidationRules, validate } = require('../middleware/validate');
const { isAuthenticated } = require("../middleware/authenticate");
const { isAdmin } = require("../middleware/authorize");

//GET route for all books
bookRouter.get('/', getAllBooks);

//GET route for single book
bookRouter.get('/:id', getSingleBook);

//POST route to create new book entry
bookRouter.post(
    '/',
    isAuthenticated,
    isAdmin, //must have admin status to make changes
    bookValidationRules(),
    validate,
    createBook);

//PUT route to update a book entry
bookRouter.put('/:id',
    /* To ensure that the PUT route in api-docs has a body space for updates
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Updated book information',
            required: true,
            schema: {
                title: 'any',
                authorFirstName: 'any',
                authorLastName: 'any'
            }
        }
    */
    isAuthenticated,
    isAdmin, //must have admin status to make changes
    bookValidationRules(),
    validate,
    updateBook);

//DELETE route to delete a book entry
bookRouter.delete('/:id',
    isAuthenticated,
    isAdmin, //must have admin status to make changes
    deleteBook);

module.exports = bookRouter;