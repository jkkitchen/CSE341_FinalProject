const isAdmin = (req, res, next) => {
    //Check if user is logged in or if they are logged in but do not have admin role
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Must be an admin to access these pages" });
    }
    //If role is admin it will pass them through
    next();
};

module.exports = { isAdmin };