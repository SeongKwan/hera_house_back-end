const express = require('express');
const passport = require('passport');

const router = express.Router();

const tokenList = {};

router.post('/join', (req, res, next) => {
    return passport.authenticate('local-signup', (err) => {
        if (err) {
            if (err.name === 'MongoError' && err.code === 11000) {
                // the 11000 Mongo code is for a duplication email error
                // the 409 HTTP status code is for conflict error
                return res.status(409).json({
                    success: false,
                    message: '이미 등록된 계정입니다',
                });
            }

            return res.status(400).json({
                success: false,
                message: '알 수 없는 오류가 발생하였습니다'
            });
        }

        return res.status(200).json({
            success: true,
            message: '성공적으로 등록되었습니다'
        });
    })(req, res, next);
});

router.post('/login', (req, res, next) => {
    return passport.authenticate('local-login', (err, tokenData, userData) => {
        if (err) {
            if (err.name === 'IncorrectCredentialsError') {
                return res.status(405).json({
                    success: false,
                    message: err.message
                });
            }

            return res.status(405).json({
                success: false,
                message: 'Could not process the form.'
            });
        }

        const response = {
            success: true,
            token: tokenData.token,
            refreshToken: tokenData.refreshToken,
            message: `로그인에 성공했어요!!`,
            user: userData
        };
        tokenList[tokenData.refreshToken] = response;
        return res.json(response);
    })(req, res, next);
});

module.exports = router;