const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: String,
    authorFirstName: String,
    authorLastName: String
});

//Third entry is the name of the collection on MongoDB
const Book = mongoose.model('Book', bookSchema, 'book');

module.exports = Book;