const app = require('express');
const router = app.Router();
const userApiModel = require('../model/userApiModel');
const utility = require('../utility');
const keys = require('../keys');
const content = require('../content');
const tableModel = require('../model/tableModel');
const userPostApiModel = require('../model/userPostApiModel');

router.get('/getAllApi', utility.isLoggedIn, async function (req, res, next) {
    const userName = req.user.userName;
    try {
        const apiList = await userApiModel.find({ userName }).select({ mainKey: 1, hitCount: 1, apiType: 1, _id: 0 });
        const postApiList = await tableModel.find({ userName }).select({ apiKey: 1, hitCount: 1, _id: 0 });
        const postApiResultList = postApiList.map(item => {
            return {
                url: `${keys.BASE_URL}/${keys.CUSTOM_API_ROOT}/${req.user.userName}/${item.apiKey}`,
                type: 'POST',
                hitCount: item.hitCount,
                key: item.apiKey
            }
        })
        const resultList = apiList.map(item => {
            return {
                url: `${keys.BASE_URL}/${keys.CUSTOM_API_ROOT}/${req.user.userName}/${item.mainKey}`,
                type: item.apiType,
                hitCount: item.hitCount,
                key: item.mainKey
            }
        });
        const finalApiList = [...resultList, ...postApiResultList];
        res.json(finalApiList);

    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

router.post('/createUserApi', utility.isLoggedIn, async function (req, res, next) {
    const requestData = req.body;   // requestData format expected {apiName: "some name", responseBody: Object}
    try {
        const apiPathRegex = /^[a-zA-Z0-9]+$/;
        const userName = req.user.userName;
        // checking if the api path already present
        const existingDoc = await userApiModel.findOne({ mainKey: requestData.apiName, userName });
        // checking fields are valid
        if (typeof requestData.responseBody !== "object" || requestData.responseBody === null || !apiPathRegex.test(requestData.apiName)) {
            res.status(500).send("could'nt process request");
        } else if (existingDoc) {
            res.status(403).send({ message: content.pathAlreadyExist });
        } else {
            const saveObject = {};
            saveObject.mainKey = requestData.apiName;
            saveObject.userName = userName;
            saveObject.responseString = JSON.stringify(requestData.responseBody);
            const savedObject = await new userApiModel(saveObject).save();
            res.locals.savedId = savedObject._id;
            res.status(201).json({ apiName: `${keys.BASE_URL}/${keys.CUSTOM_API_ROOT}/${savedObject.userName}/${savedObject.mainKey}`, responseBody: JSON.parse(savedObject.responseString) });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("could'nt process request");
    }
});

router.post('/updateUserApi', utility.isLoggedIn, async function (req, res, next) {
    const requestData = req.body;
    try {
        const apiPathRegex = /^[a-zA-Z0-9]+$/;
        const userName = req.user.userName;
        // checking if the api path already present
        const existingDoc = await userApiModel.findOne({ mainKey: requestData.apiName, userName });
        // checking fields are valid
        if (typeof requestData.responseBody !== "object" || requestData.responseBody === null || !apiPathRegex.test(requestData.apiName)) {
            res.status(500).send("could'nt process request");
        } else if (existingDoc) {
            existingDoc.responseString = JSON.stringify(requestData.responseBody);
            const savedObject = await existingDoc.save();
            res.json({ apiName: `${keys.BASE_URL}/${keys.CUSTOM_API_ROOT}/${savedObject.userName}/${savedObject.mainKey}`, responseBody: JSON.parse(savedObject.responseString) });
        } else {
            res.status(403).send();
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("could'nt process request");
    }
})

router.get('/checkUserApiValid/:mainKey', utility.isLoggedIn, async function (req, res, next) {
    const userName = req.user.userName;
    const mainKey = req.params.mainKey;
    try {
        const apiPathRegex = /^[a-zA-Z0-9]+$/;
        if (apiPathRegex.test(mainKey)) {
            const availableDoc = await userApiModel.findOne({ mainKey, userName });
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

router.post('/deleteUserApi', utility.isLoggedIn, async function (req, res, next) {
    const requestBody = req.body;           // we are expecting the body to be {key: String, type: GET/POST}
    const mainKey = requestBody.key;
    const type = requestBody.type;
    const userName = req.user.userName;
    try {
        if (type === 'GET') {
            const deleteObject = await userApiModel.deleteOne({ userName, mainKey });
            res.status(200).send();
        } else if (type === 'POST') {
            await tableModel.deleteOne({ userName, apiKey: mainKey });
            await userPostApiModel.deleteOne({ userName, apiKey: mainKey });
            res.status(200).send();
        }

    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

router.post('/createNewTable', utility.isLoggedIn, async function (req, res, next) {
    const requestBody = req.body;
    const userName = req.user.userName;
    requestBody.userName = userName;
    try {
        const newTableObject = new tableModel(requestBody);
        const tableDataObject = new userPostApiModel({ userName, apiKey: requestBody.apiKey })
        await newTableObject.save();
        await tableDataObject.save();
        res.status(201).send();
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

router.get('/getAllTable', utility.isLoggedIn, async function (req, res, next) {
    const userName = req.user.userName;
    try {
        const tableList = await tableModel.find({ userName }).select({ _id: 0, tableName: 1, apiKey: 1 });
        res.json(tableList);
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

router.get('/getTableData/:apiKey', utility.isLoggedIn, async function (req, res, next) {
    const userName = req.user.userName;
    const apiKey = req.params.apiKey;
    try {
        const apiDataObject = await userPostApiModel.findOne({ apiKey, userName });
        const apiSchemaObject = await tableModel.findOne({ apiKey, userName }).select({_id: 0, hitCount: 0});
        if (apiDataObject && apiSchemaObject) {
            res.json({ dataList: apiDataObject.dataArray, schema: apiSchemaObject });
        } else {
            res.status(500).send();
        }
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
})

module.exports = router;