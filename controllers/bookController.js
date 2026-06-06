const Book = require('../models/Book');

//Function to retrieve all book data
const getAllBooks = async (req, res) => {
    try {
        //Use .find to find matching documents in the Mongo collection, to narrow it down you would enter a condition in the parentheses
        const books = await Book.find();

        //200 means successful and data will be converted to JSON file
        res.status(200).json(books)

    } catch (err) {
        //500 means server error
        res.status(500).json({ message: err.message });
    }
};

//Function to retrieve data for one book
const getSingleBook = async (req, res) => {
    try {
        //Return a single document from book where id matches the id from query parameter
        //Use findById function, it will pull the id from the route (params means values that are part of the URL path)
        const book = await Book.findById(req.params.id);
        
        //Make sure book exists
        if (!book) {
            return res.status(404).json({ message: 'Book data not found' });
        }

        //200 means successful and data will be converted to JSON file
        res.status(200).json(book)
            
    } catch (err) {
        //500 means server error
        res.status(500).json({ message: err.message });
    }
};

//Function to create book entry
const createBook = async (req, res) => {
    try {
        const newBook = new Book({
            title: req.body.title,
            authorFirstName: req.body.authorFirstName,
            authorLastName: req.body.authorLastName
        });
        //.save writes it into MongoDB
        const savedBook = await newBook.save();
        //201 means a new resource was created
        res.status(201).json(savedBook);
    } catch (err) {
        //500 means server error
        res.status(500).json({ message: err.message });
    }
};

//Function to update book entry
const updateBook = async (req, res) => {
    try {
        //Update an existing book entry using findByIdAndUpdate function
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } //new:true returns updated document, runValidators:true enforces schema rules
        );

        //Use an if statement to determine if book data exists
        if (!updatedBook) {
            return res.status(404).json({ message: 'Book data not found' });
        };

        //200 means successful and data will be converted to JSON file
        res.status(200).json(updatedBook);

    } catch (err) {
        //500 means server error
        res.status(500).json({ message: err.message });
    }
};

//Function to delete book entry
const deleteBook = async (req, res) => {
    try {
        //Delete an existing book entry using findByIdAndDelete function
        const deletedBook = await Book.findByIdAndDelete(req.params.id);

        //Use an if statement to determine if book entry exists
        if (!deletedBook) {
            return res.status(404).json({ message: 'Book data not found' });
        };

        //Otherwise return success message
        res.status(200).json({ message: 'Book data deleted successfully' });

    } catch (err) {
        //500 means server error
        res.status(500).json({ message: err.message });
    }
};

//Export
module.exports = {
    getAllBooks,
    getSingleBook,
    createBook,
    updateBook,
    deleteBook
}
