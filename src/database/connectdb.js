const mongoose = require("mongoose");

const connectDB = async () => {
    mongoose.connect("mongodb://localhost/userapi", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
}

module.exports = connectDB;