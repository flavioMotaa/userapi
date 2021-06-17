const express = require("express");
const app = express();

const projects = require("./app/controllers/projectController");
const auther = require("./app/controllers/authController");
const connectDB = require("./database/connectdb");
connectDB()

app.use(express.urlencoded({extended: false}))
app.use(express.json());

app.use("/auth", auther);
app.use("/projects", projects)

app.listen(8080, () => { console.log("Hello, World") })