const jwt = require('jsonwebtoken')
const { unauthorizedRequest, badRequest } = require('../utils/response-helper');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    // console.log('authHeader', authHeader)
    if (!authHeader) {
        throw badRequest('Not authenticated.')
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'somesupersecretsecret');
    } catch (err) {
        next(err)
    }
    if (!decodedToken) {
        throw unauthorizedRequest('Not authenticated.')
    }
    req.userId = decodedToken.userId;
    req.userRole =decodedToken.user_role;
    next();
};
