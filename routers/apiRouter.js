const app = require('express');
const router = app.Router();
const responseModel = require('../model/responseModel');

router.get('/:firstParameter', async function (req, res, next) {
    // search from the database record for the corresponding
    // first parameter and send it to the user;
    const mainKey = req.params.firstParameter;
    try {
        const dbObject = await responseModel.findOne({ mainKey: mainKey });
        if (dbObject) {
            const responseObject = JSON.parse(dbObject.responseString);
            res.json(responseObject);
        } else {
            res.status(404).send("No such api exists");
        }
    } catch (error) {
        console.log(error);
        res.status(404).send("No such api exists");
    }
})

module.exports = router;
