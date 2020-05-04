const Category = require('../models/Category');


exports.getCategories = function (req, res) {
    Category.find().exec()
        .then(categories => res.send(categories))
        .catch((err) => console.error(err))
};


exports.getCategory = function (req, res) {
    Category.findOne({
        _id: req.params.caregoryId
    }, function (err, category) {
        if (!err) {
            res.send(category);
        } else {
            res.send('No matched category with passed cateogry_id.');
        }
    });
};


exports.createCategory = function (req, res) {
    Category.countDocuments(function (err, count) {
        if (err) throw err;
        
        let Content = req.body || {};
        let newCategory = new Category(Content);

        newCategory.order = count + 1;

        newCategory.save(function (err, newCategory) {
            if (!err) {
                res.json({
                    newCategory,
                    code: 200,
                    message: "새로운 카테고리가 추가되었습니다"
                })
            } else {
                res.send(err);
            }
        });
    });
};


exports.updateCategoryOrder = function (req, res) {
    let { categories } = req.body;
    let THIS = this;
    THIS.updatedCategories = [];
    
    return categories.forEach((category, index) => {
        Category.findByIdAndUpdate(category._id, category, {
            overwrite: true, useFindAndModify: false, new: true
        }).exec((err, updatedCategory) => {
            if (!err) {
                THIS.updatedCategories.push(updatedCategory)
                if ((index + 1) === categories.length) {
                    res.json({
                        updatedCategories: THIS.updatedCategories,
                        code: 200,
                        message: `카테고리 순서가 변경되었습니다`
                    })
                }
            } else {
                res.send(err);
            }
        })
    });
};


exports.deleteCategory = function (req, res) {
    Category.deleteOne({
        _id: req.params.categoryId
    }, function (err, foundCategory) {
        if (!err) {
            res.json({
                code: 200,
                message: "카테고리가 삭제되었습니다"
            })
        } else {
            res.send(err);
        }
    });

};