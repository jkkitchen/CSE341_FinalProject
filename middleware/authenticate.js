const isAuthenticated = (req, res, next) => {
    //Use Passport to check if user is authenticated rather than Express-Sessions
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized - Please login first' });
};

module.exports = { isAuthenticated };