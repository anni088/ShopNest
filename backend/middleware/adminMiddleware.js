const admin = (req, res, next) => {
    if(req.user && req.user.role == 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access Denied, Admin only' });
    }
};

module.exports = { admin };