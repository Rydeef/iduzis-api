const {
    Schema,
    model
} = require("mongoose");

const schema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    owner: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    checked: {
        type: Boolean,
        required: true,
    },
});

module.exports = model("todo", schema);