const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    id: String,
    name: {type: String, required: true},
    description: {type: String, default: ''},
    order: {type: Number, required: true, default: 0}
});

module.exports = mongoose.model('Category', CategorySchema);