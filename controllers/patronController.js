const Patron = require('../models/Patron');

//Function to retrieve all patron data
const getAllPatrons = async (req, res) => {
    try {
        //Use .find to find matching documents in the Mongo collection, to narrow it down you would enter a condition in the parentheses
        const patrons = await Patron.find();

        //200 means successful and data will be converted to JSON file
        res.status(200).json(patrons)
    } catch (err) {
        //500 means server error
        res.status(500).json({ message: err.message });
    }
};

//Function to retrieve data for one patron
const getSinglePatron = async (req, res) => {
    try {
        //Return a single document from patron where id matches the id from query parameter
        //Use findById function, it will pull the id from the route (params means values that are part of the URL path)
        const patron = await Patron.findById(req.params.id);

        //Make sure patron exists
        if (!patron) {
            return res.status(404).json({ message: 'Patron data not found' });
        }
        
        //200 means successful and data will be converted to JSON file
        res.status(200).json(patron)
            
    } catch (err) {
        //500 means server error
        res.status(500).json({ message: err.message });
    }
};

//No function to create patron because this is done by Passport in server.js

//No function to update patron entry because this data comes from GitHub or Google

//Function to delete patron entry
const deletePatron = async (req, res) => {
    try {
        //Delete an existing patron entry using findByIdAndDelete function
        const deletedPatron = await Patron.findByIdAndDelete(req.params.id);

        //Use an if statement to determine if patron entry exists
        if (!deletedPatron) {
            return res.status(404).json({ message: 'Patron data not found' });
        };

        //Otherwise return success message
        res.status(200).json({ message: 'Patron data deleted successfully' });

    } catch (err) {
        //500 means server error
        res.status(500).json({ message: err.message });
    }
};

//Export
module.exports = {
    getAllPatrons,
    getSinglePatron,
    deletePatron
}
