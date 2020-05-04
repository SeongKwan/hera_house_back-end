const User = require('../models/User');


exports.getArticleList = function (req, res) {
    User.find().exec()
        .then(users => res.send(users))
        .catch((err) => console.error(err))
};
