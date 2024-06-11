const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const data = jwt.verify(token, process.env.ACCESS_SECRET);
        req.user = data;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Forbidden' });
    }
};

module.exports = {
    authenticateToken
};