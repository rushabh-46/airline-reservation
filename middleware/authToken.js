const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config');
const { sendResponse } = require('../utils/response');

const authenticateToken = (req, res, next) => {
    let bearerToken = req.headers['authorization'];
    if (!bearerToken) {
        return sendResponse(res, 401, false, 'Missing token');
    }
    let token = bearerToken.split(' ')[1];
    try {
        jwt.verify(token, jwtConfig.secretKey, (err, user) => {
            if (err) {
                console.error('Invalid or expired token');
                return sendResponse(res, 403, false, 'Invalid or expired token');
            };
            console.log('Authentication successful');
            console.log('User Details:', user);
            req.user = user;
            next();
        });
    } catch (err) {
        return sendResponse(res, 500, false, 'Internal server error', null, err.message);
    }
};

module.exports = authenticateToken;
