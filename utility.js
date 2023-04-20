const exportModule = {
    checkValidJson: function (inputString) {
        try {
            JSON.parse(inputString);
            return true;
        } catch (error) {
            return false;
        }
    },
    isLoggedIn: function (req, res, next) {
        if (req.user) {
            next();
        } else {
            res.status(503).send();
        }
    },
    checkObjectValidWithSchema: function (schema, testObject) {
        try {
            const resultObject = {};
            schema.forEach((column) => {
                const inputValue = testObject[column.columnKey];
                if (inputValue !== undefined) {
                    if (!this.validateColumnDataType(inputValue, column.columnType)) throw Error('not valid');
                    this.validateColumnDataType(inputValue, column.columnType);
                    resultObject[column.columnKey] = inputValue;
                } else {
                    resultObject[column.columnKey] = column.defaultValue;
                }
            });
            return resultObject;
        } catch (error) {
            return null;
        }
    },
    validateColumnDataType: function (inputValue, columnType) {
        if (!['Number', 'Boolean', 'Array', 'Object', 'String'].includes(columnType)) return false;
        if (columnType === 'Number' && typeof inputValue !== 'number') return false;
        if (columnType === 'Boolean' && typeof inputValue !== 'boolean') return false;
        if (columnType === 'Array' && !Array.isArray(inputValue)) return false;
        if (columnType === 'Object' && typeof inputValue !== 'object') return false;
        if (columnType === 'String' && typeof inputValue !== 'string') return false;
        return true;
    }
}

module.exports = exportModule; 