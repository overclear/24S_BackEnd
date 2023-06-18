const mongoose = require("mongoose");

const users = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    age: {
        type: Number,
        require: true,
    },
    email: {
        type: String,
        require: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter a valid email"],
    },
    avatarUrl: {
        type: String,
        require: true,
    },
});

module.exports = mongoose.model("users", users);
