const app = require('express');
const router = app.Router();
const responseModel = require('../model/responseModel');

router.get('/:queryPath', async (req, res, next) => {
    const queryPath = req.params.queryPath;
    try {
        const apiPathRegex = /^[a-zA-Z0-9]+$/;
        if (apiPathRegex.test(queryPath)) {
            const availableDoc = await responseModel.findOne({mainKey: queryPath});
            // if the entered api is not present in the db
            if (!availableDoc) {
                res.status(200).send();
            } else {
                res.status(404).send();
            }
        } else {
            res.status(500).send();
        }
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

module.exports = router;