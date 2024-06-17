const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config');
const { sendResponse } = require('../utils/response');

exports.authenticate = (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return sendResponse(res, 400, false, 'Email is required');
        }
        const token = jwt.sign({ email }, jwtConfig.secretKey, { expiresIn: '1h' });
        console.info(`Generated token for email ${email}`);
        return sendResponse(res, 200, true, 'Token is generated', {token});
    } catch (err) {
        console.error('Error in authentication: ' + err.message);
        return sendResponse(res, 500, false, 'Internal server error', null, err.message);
    }
};
