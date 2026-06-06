const Location = require('../models/Location');

//Function to retrieve all location data
const getAllLocations = async (req, res) => {
    try {
        //Use .find to find matching documents in the Mongo collection, to narrow it down you would enter a condition in the parentheses
        const locations = await Location.find();

        //200 means successful and data will be converted to JSON file
        res.status(200).json(locations)
    } catch (err) {
        //500 means server error
        res.status(500).json({ message: err.message });
    }
};

//Function to retrieve data for one location
const getSingleLocation = async (req, res) => {
    try {
        //Return a single document from location where id matches the id from query parameter
        //Use findById function, it will pull the id from the route (params means values that are part of the URL path)
        const location = await Location.findById(req.params.id);

        //Make sure location exists
        if (!location) {
            return res.status(404).json({ message: 'Location data not found' });
        }
        
        //200 means successful and data will be converted to JSON file
        res.status(200).json(location)
            
    } catch (err) {
        //500 means server error
        res.status(500).json({ message: err.message });
    }
};

//Function to create location entry
const createLocation = async (req, res) => {
    try {
        const newLocation = new Location({
            name: req.body.name,
            address: req.body.address
        });
        //.save writes it into MongoDB
        const savedLocation = await newLocation.save();
        //201 means a new resource was created
        res.status(201).json(savedLocation);
    } catch (err) {
        //500 means server error
        res.status(500).json({ message: err.message });
    }
};

//Function to update location entry
const updateLocation = async (req, res) => {
    try {
        //Update an existing location entry using findByIdAndUpdate function
        const updatedLocation = await Location.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } //new:true returns updated document, runValidators:true enforces schema rules
        );

        //Use an if statement to determine if location data exists
        if (!updatedLocation) {
            return res.status(404).json({ message: 'Location data not found' });
        };

        //200 means successful and data will be converted to JSON file
        res.status(200).json(updatedLocation);

    } catch (err) {
        //500 means server error
        res.status(500).json({ message: err.message });
    }
};

//Function to delete location entry
const deleteLocation = async (req, res) => {
    try {
        //Delete an existing location entry using findByIdAndDelete function
        const deletedLocation = await Location.findByIdAndDelete(req.params.id);

        //Use an if statement to determine if location entry exists
        if (!deletedLocation) {
            return res.status(404).json({ message: 'Location data not found' });
        };

        //Otherwise return success message
        res.status(200).json({ message: 'Location data deleted successfully' });

    } catch (err) {
        //500 means server error
        res.status(500).json({ message: err.message });
    }
};

//Export
module.exports = {
    getAllLocations,
    getSingleLocation,
    createLocation,
    updateLocation,
    deleteLocation
}
