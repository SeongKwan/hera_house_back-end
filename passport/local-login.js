const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const PassportLocalStrategy = require('passport-local').Strategy;

/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true
}, (req, email, password, done) => {
    //console.log('Passport Local Strategy')
    const userData = {
        email: email.trim(),
        password: password.trim()
    };

    // find a user by email address
    return User.findOne({
        email: userData.email
    }, (err, user) => {
        if (err) {
            return done(err);
        }

        if (!user) {
            const error = new Error('미등록된 계정입니다');
            error.name = 'IncorrectCredentialsError';
            return done(error);
        }

        // check if a hashed user's password is equal to a value saved in the database
        return user.comparePassword(userData.password, (passwordErr, isMatch) => {
            if (err) {
                return done(err);
            }

            if (!isMatch) {
                const error = new Error('비밀번호가 다름!!');
                error.name = 'IncorrectCredentialsError';
                return done(error);
            }

            const payload = {
                sub: user._id
            };

            // create a token string
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: process.env.TOKEN_LIFE
            });
            const refreshToken = jwt.sign(payload, process.env.REFRESH_JWT_SECRET, {
                expiresIn: process.env.REFRESH_TOKEN_LIFE
            })
            const tokenData = {
                token: token,
                refreshToken: refreshToken
            };
            const userData = {
                email: user.email,
                user_id: user._id
            };

            return done(null, tokenData, userData);
        });
    });
});