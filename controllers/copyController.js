const Copy = require('../models/Copy');


//Function to retrieve all copy data
const getAllCopies = async (req, res) => {
    try {
        //Use .find to find matching documents in the Mongo collection, to narrow it down you would enter a condition in the parentheses
        const copies = await Copy.find();

        //Only admins should be able to see the patronID so we must remove it from the results here before it is called in Routes
        const isAdmin = req.user?.role === "admin";
        const result = copies.map(copy => {
            //Turn into an object so we can modify and remove patronIDs
            const copyObject = copy.toObject();
            //Remove patronID if not admin
            if (!isAdmin) {
                delete copyObject.patronID;
            }
            return copyObject;
        })

        //200 means successful and data will be converted to JSON file
        res.status(200).json(result)
    } catch (err) {
        //500 means server error
        res.status(500).json({ message: err.message });
    }
};

//Function to retrieve data for one copy
const getSingleCopy = async (req, res) => {
    try {
        //Return a single document from copy where id matches the id from query parameter
        //Use findById function, it will pull the id from the route (params means values that are part of the URL path)
        const copy = await Copy.findById(req.params.id);
        
        //Make sure copy exists
        if (!copy) {
            return res.status(404).json({ message: 'Copy not found' });
        }

        //Only admins should be able to see the patronID so we must remove it from the results here before it is called in Routes
        //Convert to plain object so it can be modified
        const isAdmin = req.user?.role === "admin";
        const copyData = copy.toObject();
        //Remove patronID if not admin
        if (!isAdmin) {
            delete copyData.patronID;
        }

        //200 means successful and data will be converted to JSON file
        res.status(200).json(copyData)
            
    } catch (err) {
        //500 means server error
        res.status(500).json({ message: err.message });
    }
};

//Function to create copy entry
const createCopy = async (req, res) => {
    try {
        const newCopy = new Copy({
            bookID: req.body.bookID,
            locationID: req.body.locationID,
            format: req.body.format,
            publishingYear: req.body.publishingYear,
            ISBN: req.body.ISBN,
            checkedIn: req.body.checkedIn,
            patronID: req.body.patronID
        });
        //.save writes it into MongoDB
        const savedCopy = await newCopy.save();
        //201 means a new resource was created
        res.status(201).json(savedCopy);
    } catch (err) {
        //500 means server error
        res.status(500).json({ message: err.message });
    }
};

//Function to update copy entry
const updateCopy = async (req, res) => {
    try {
        //Update an existing copy entry using findByIdAndUpdate function
        const updatedCopy = await Copy.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } //new:true returns updated document, runValidators:true enforces schema rules
        );

        //Use an if statement to determine if copy data exists
        if (!updatedCopy) {
            return res.status(404).json({ message: 'Copy data not found' });
        };

        //Only allow admins to see patronID
        const isAdmin = req.user?.role === "admin";
        //Convert to object so it can be modified to remove patron ID
        const updatedCopyData = updatedCopy.toObject();
        //If not admin, remove patron ID
        if (!isAdmin) {
            delete updatedCopyData.patronID;
        }

        //200 means successful and data will be converted to JSON file
        res.status(200).json(updatedCopyData);

    } catch (err) {
        //500 means server error
        res.status(500).json({ message: err.message });
    }
};

//Function to delete copy entry
const deleteCopy = async (req, res) => {
    try {
        //Delete an existing copy entry using findByIdAndDelete function
        const deletedCopy = await Copy.findByIdAndDelete(req.params.id);

        //Use an if statement to determine if copy exists
        if (!deletedCopy) {
            return res.status(404).json({ message: 'Copy data not found' });
        };

        //Otherwise return success message
        res.status(200).json({ message: 'Copy data deleted successfully' });

    } catch (err) {
        //500 means server error
        res.status(500).json({ message: err.message });
    }
};

//Export
module.exports = {
    getAllCopies,
    getSingleCopy,
    createCopy,
    updateCopy,
    deleteCopy
}
