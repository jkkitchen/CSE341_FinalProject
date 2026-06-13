const { body, validationResult } = require('express-validator');

//Variables to restrict values in validation functions below
const validFormats = ['paperback', 'hardcover', 'ebook', 'audiobook'];
const validProviders = ['github', 'google'];

//Validation rules for book collection
const bookValidationRules = () => {
    return [
        body('title')
            .notEmpty()
            .isString()
            .trim()
            .withMessage('Title is required.'),
        body('authorFirstName')
            .notEmpty()
            .isString()
            .trim()
            .withMessage("Author's first name is required."),
        body('authorLastName')
            .notEmpty()
            .isString()
            .trim()
            .withMessage("Author's last name is required.")        
    ]
}

//Validation rules for location collection
const locationValidationRules = () => {
    return [
        body('name')
            .notEmpty()
            .isString()
            .trim()
            .withMessage('Library branch name is required.'),
        body('address')
            .notEmpty()
            .isString()
            .trim()
            .withMessage('Address is required.')        
    ]
}

//Validation rules for copy collection--these need to match with fields entered in MongoDB
//Each copy is ONE specific book in the library, there are not multiple copies.
//Even if there were multiple copies of a book in the same format, at the same location they would each be entered as a separate copy
//and have their own ID assigned in the copy collection. That way we can check if they're checked in or not.
const copyValidationRules = () => {
    return [
        body('bookID')
            .notEmpty()
            .isMongoId()            
            .withMessage('Book ID required and must be valid.'),
        body('locationID')
            .notEmpty()
            .isMongoId()
            .withMessage('Location ID is required and must be valid.'),
        body('format')
            .notEmpty()
            .isString()
            .trim()
            .isIn(validFormats)
            .withMessage('Format must be paperback, hardcover, ebook, or audiobook.'),
        body('publishingYear')
            .notEmpty()
            .isInt({ min: 1000, max: new Date().getFullYear() })            
            .withMessage('Publication year must be a valid year.'),
        body('ISBN')
            .notEmpty()
            .isString()
            .trim()
            .withMessage('ISBN is required.'),
        body('checkedIn')
            .notEmpty()
            .isBoolean().toBoolean() //Converts True/False strings to real booleans            
            .withMessage('Check-in Status must be True or False.'),
        body('patronID')
            .optional({nullable: true, checkFalsy: true }) //Skip if null, undefined, "", or false
            .isMongoId()
            .withMessage('Patron ID must be valid if book is checked out.'),
        body().custom((value, { req }) => {
            const checkedIn = req.body.checkedIn;
            const patronID = req.body.patronID;

            // If book is checked OUT (checkedIn === false), it SHOULD have a patronID
            if (checkedIn === false && !patronID) {
                throw new Error('Patron ID is required when book is checked out.');
            }

            // If book is checked IN, it should NOT have a patronID
            if (checkedIn === true && patronID) {
                throw new Error('Cannot have a patron ID when the book is checked in.');
            }

            return true;
        })
    ]
}

//No validation rules needed for patron collection because all values supplied by OAuth

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.path]: err.msg })); //err.path is preferred to err.param in newer express-validator versions
    return res.status(422).json({ errors: extractedErrors });
};

module.exports = {
    bookValidationRules,
    locationValidationRules,
    copyValidationRules,
    validate
};