//Increase timeout for jest
jest.setTimeout(15000);

//Add mock authentication and admin role to test routes without logging in
jest.mock('../middleware/authenticate', () => ({
    isAuthenticated: (req, res, next) => next()
}));

jest.mock('../middleware/authorize', () => ({
    isAdmin: (req, res, next) => next()
}));

//Add mock mongoose models--no actual database connection
jest.mock('../models/Book', () => ({
    find: jest.fn().mockResolvedValue([
        { _id: "b1", title: "Test Book" }
    ]),
    findById: jest.fn().mockResolvedValue(
        { _id: "b1", title: "Test Book" }
    )
}));

jest.mock('../models/Patron', () => ({
    find: jest.fn().mockResolvedValue([
        { _id: "p1", username: "Test Patron" }
    ]),
    findById: jest.fn().mockResolvedValue(
        { _id: "p1", username: "Test Patron" }
    )
}));

jest.mock('../models/Location', () => ({
    find: jest.fn().mockResolvedValue([
        { _id: "l1", name: "Test Location" }
    ]),
    findById: jest.fn().mockResolvedValue(
        { _id: "l1", name: "Test Location" }
    )
}));

jest.mock('../models/Copy', () => ({ //This one is different because copyController converts response to object
    find: jest.fn().mockResolvedValue([
        {
            _id: "c1",
            format: "ebook",
            toObject: function () {
                return {
                    _id: "c1",
                    format: "ebook"
                };
            }
        }
    ]),
    findById: jest.fn().mockResolvedValue({
        _id: "c1",
        format: "ebook",
        toObject: function () {
            return {
                _id: "c1",
                format: "ebook"
            };
        }
    })
}));


//Imports
const request = require('supertest');
const app = require('../server');

//Test all API Routes
describe('API Routes', () => {

    //ROOT route test
    test('GET / should return login status', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toMatch(/Logged/);
    });

    //GET ALL BOOKS
    test('GET /books should return all books', async () => {
        const res = await request(app).get('/books');
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
    });

    //GET SINGLE BOOK
    test('GET /books/:id should return single book', async () => {        
        const res = await request(app).get('/books/b1');
        expect(res.statusCode).toBe(200);
    });

    // GET ALL PATRONS
    test('GET /patrons should return all patrons', async () => {
        const res = await request(app).get('/patrons');
        expect(res.statusCode).toBe(200);
    });

    //GET SINGLE PATRON
    test('GET /patrons/:id should return single patron', async () => {        
        const res = await request(app).get('/patrons/p1');
        expect(res.statusCode).toBe(200);
    });

    // GET ALL LOCATIONS
    test('GET /locations should return all locations', async () => {
        const res = await request(app).get('/locations');
        expect(res.statusCode).toBe(200);
    });

    //GET SINGLE LOCATION
    test('GET /locations/:id should return single location', async () => {        
        const res = await request(app).get('/locations/l1');
        expect(res.statusCode).toBe(200);
    });

    // GET ALL COPIES
    test('GET /copies should return all copies', async () => {
        const res = await request(app).get('/copies');
        expect(res.statusCode).toBe(200);
    });

    //GET SINGLE COPY
    test('GET /copies/:id should return single copy', async () => {        
        const res = await request(app).get('/copies/c1');
        expect(res.statusCode).toBe(200);
    });

});
