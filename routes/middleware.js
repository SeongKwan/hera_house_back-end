const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        req.decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userId = req.decoded.sub;

        // check if a user exists
        return User.findById(userId, (userErr, user) => {
            if (userErr || !user) {
                return res.status(401).json({
                    code: 417,
                    type: "guest",
                    message: '가입해 주세요'
                });
            }

            req.userId = userId;
            return next();
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(419).json({
                code: 419,
                type: "expired",
                message: '토큰이 만료되었습니다',
            });
        }
        return res.status(401).json({
            code: 401,
            type: "invalid",
            message: '유효하지 않은 토큰입니다',
        });
    }
};