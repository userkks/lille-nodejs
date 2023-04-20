const app = require('express');
const router = app.Router();
const responseModel = require('../model/responseModel');
const keys = require('../keys');
const content = require('../content');

router.post('/', async function (req, res, next) {
    const requestData = req.body;   // requestData format expected {apiName: "some name", responseBody: Object}
    try {
        const apiPathRegex = /^[a-zA-Z0-9]+$/;
        // checking if the api path already present
        const existingDoc = await responseModel.findOne({ mainKey: requestData.apiName });
        // checking fields are valid
        if (typeof requestData.responseBody !== "object" || requestData.responseBody === null || !apiPathRegex.test(requestData.apiName)) {
            res.status(500).send("could'nt process request");
        } else if (existingDoc) {
            res.status(403).json({message: content.pathAlreadyExist});
        } else {
            const saveObject = {};
            saveObject.mainKey = requestData.apiName;
            saveObject.responseString = JSON.stringify(requestData.responseBody);
            const savedObject = await new responseModel(saveObject).save();
            res.locals.savedId = savedObject._id;
            res.status(201).json({ apiName: `${keys.BASE_URL}/api/${savedObject.mainKey}`, responseBody: JSON.parse(savedObject.responseString) });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("could'nt process request");
    }
});

module.exports = router;