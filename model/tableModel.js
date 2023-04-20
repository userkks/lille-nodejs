const mongoose = require('mongoose');

const tableColumnSchema = new mongoose.Schema({
    columnName: {
        type: String,
        required: true
    },
    userName: String,
    columnKey: {
        type: String,
        required: true,
        validate: function (value) {
            return /^[a-zA-Z0-9]+$/.test(value);
        }
    },
    columnType: {
        type: String,
        required: true,
        enum: ['String', 'Number', 'Boolean', 'Object', 'Array']
    },
    defaultValue: {
        type: mongoose.Schema.Types.Mixed
    }
});

const createNewTableSchema = new mongoose.Schema({
    apiKey: {
        type: String,
        validate: function (value) {
            return /^[a-zA-Z0-9]+$/.test(value);
        },
        required: true
    },
    tableName: {
        type: String,
        required: true
    },
    hitCount: {
        type: Number,
        default: 0
    },
    userName: String,
    columnFormArray: {
        type: [tableColumnSchema],
        validate: function (value) {
            // check if atleast one column is there
            if (!value.length) return false;
            const columnKeyList = value.map(column => column.columnKey);

            for (let index = 0; index < value.length; index++) {
                const column = value[index];
                // check if no duplicate column key is there
                if (columnKeyList.filter(columnKey => columnKey === column.apiKey).length > 1) return false;
                // check if all default values are of selected type
                if (column.defaultValue !== '') {
                    if (column.columnType === 'Number' && typeof column.defaultValue !== 'number') return false;
                    if (column.columnType === 'Boolean' && typeof column.defaultValue !== 'boolean') return false;
                    if (column.columnType === 'Array' && !Array.isArray(column.defaultValue)) return false;
                    if (column.columnType === 'Object' && typeof column.defaultValue !== 'object') return false;
                    if (column.columnType === 'String' && typeof column.defaultValue !== 'string') return false;
                }
            }

            return true;
        }
    }
});

createNewTableSchema.index({apiKey: 1, userName: 1}, {unique: true});

module.exports = mongoose.model('newTable', createNewTableSchema);