const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: String,
    address: String
});

//Third entry is the name of the collection on MongoDB
const Location = mongoose.model('Location', locationSchema, 'location');

module.exports = Location;