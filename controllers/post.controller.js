const Post = require('../models/Post');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
let moment = require('moment');

fs.readdir('uploads', (error) => {
    if (error) {
        console.error('Create folder for uploaded images.');
        fs.mkdirSync('uploads');
    }
});

exports.uploadImages = function (req, res) {
    return res.json({
        code: 200,
        files: req.files
    })
}

exports.getPosts = function (req, res) {
    Post.find().exec()
        .then(posts => res.send(posts))
        .catch((err) => console.error(err))
};

exports.getPost = function (req, res) {
    Post.findOne({
        _id: req.params.postId
    }, function (err, post) {
        if (!err) {
            res.send(post);
        } else {
            res.send('No matched post with passed post_id.');
        }
    });
};

exports.createPost = function (req, res) {
    let Content = req.body || {};
    let newPost = new Post(Content);

    newPost.createdAt = moment().unix();

    newPost.save(function (err, newPost) {
        if (!err) {
            res.status(200).json({
                newPost,
                code: 200,
                message: "새로운 글이 추가되었습니다"
            })
        } else {
            res.send(err);
        }
    });
};

exports.updatePost = function (req, res) {
    const id = req.params.postId;
    console.log(req.body)
    let updatedPost = req.body || {};
    updatedPost.updatedAt = moment().unix();

    Post.findByIdAndUpdate(id, updatedPost, {
        overwrite: true,
        useFindAndModify: false,
        new: true
    }).exec((err, updatedPost) => {
        if (!err) {
            res.status(200).json({
                updatedPost,
                code: 200,
                message: "성공적으로 글이 수정되었습니다"
            })
        } else {
            res.send(err);
        }
    })

};

exports.deletePost = function (req, res) {
    Post.deleteOne({
        _id: req.params.postId
    }, function (err, foundPost) {
        if (!err) {
            res.status(200).json({
                code: 200,
                message: "글이 삭제되었습니다"
            })
        } else {
            res.send(err);
        }
    });

};

// exports.getResult = async (req, res) => {
//     if (req.body.images.length <= 0) {
//         return res.send(`You must select at least 1 image.`);
//     }

//     const images = req.body.images
//         .map(image => "" + image + "")
//         .join("");

//     return res.send(`Images were uploaded:${images}`);
// };

function toUnix(_datetime) {
    let d = new Date(_datetime);
    return moment(d, "X") * 1000;
}