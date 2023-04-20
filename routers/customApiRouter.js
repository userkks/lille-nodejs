const app = require('express');
const userApiModel = require('../model/userApiModel');
const tableModel = require('../model/tableModel');
const userPostApiModel = require('../model/userPostApiModel');
const utility = require('../utility');

const router = app.Router();

router.get('/:userName/:mainKey', async function(req, res, next) {
    const userName = req.params.userName;
    const mainKey = req.params.mainKey;
    try {
        const apiStringObject = await userApiModel.findOne({userName, mainKey}, 'responseString hitCount');
        apiStringObject.hitCount += 1;
        await apiStringObject.save();
        if (apiStringObject) {
            res.json(JSON.parse(apiStringObject.responseString));
        } else {
            // no such api path exists
            res.status(404).send('No such path exists');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

router.post('/:userName/:mainKey', async function (req, res, next) {
    const userName = req.params.userName;
    const apiKey = req.params.mainKey;
    const requestObject = req.body;
    try {
        const tableSchemaObject = await tableModel.findOne({userName, apiKey});
        const tableColumnArray = tableSchemaObject.columnFormArray;
        const filteredObject = utility.checkObjectValidWithSchema(tableColumnArray, requestObject);
        if (filteredObject) {
            const existingRecord = await userPostApiModel.findOne({apiKey});
            if (existingRecord) {
                existingRecord.dataArray.push(filteredObject);
                await existingRecord.save();
            } else {
                const saveObject = new userPostApiModel({apiKey, dataArray: [filteredObject], userName});
                await saveObject.save();
            }
            tableSchemaObject.hitCount += 1;
            await tableSchemaObject.save();
            res.status(201).send();
        } else {
            res.status(500).send();
        }
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
})

module.exports = router;