const mongoose = require('mongoose');

const copySchema = new mongoose.Schema({
    bookID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    },
    locationID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    },
    format: String,
    publishingYear: Number,
    ISBN: String,
    checkedIn: Boolean,
    patronID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patron'
    }
});

//Third entry is the name of the collection on MongoDB
const Copy = mongoose.model('Copy', copySchema, 'copy');

module.exports = Copy;