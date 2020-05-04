const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    content: {type: String, default: ''},
    createdAt: { type: Number, required: true, default: -1},
    updatedAt: { type: Number, default: -1},
    isPublished: {type: Boolean, default: false },
    thumbnail: String,
});

module.exports = mongoose.model('Post', PostSchema);