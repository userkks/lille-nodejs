const app = require('express');
const router = app.Router();
const blogModel = require('../model/blogModel');

router.get('/getAllPosts', async function (req, res, next) {
    try {
        const dbObject = await blogModel.find().select({ _id: 0 });
        res.json(dbObject);
    } catch(error) {
        console.log(error);
        res.status(500).send();
    }
});

router.get('/:blogTitle', async function (req, res, next) {
    const blogTitle = req.params.blogTitle;
    try {
        const dbObject = await blogModel.findOne({ title: blogTitle }).select({ _id: 0 });
        if (dbObject) {
            res.json(dbObject);
        } else {
            res.status(404).send();
        }
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

module.exports = router;