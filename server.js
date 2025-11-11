const express = require('express');
const app = express();
const port = 3000;

// Database connection
const mongoose = require('mongoose');
const User = require("./models/userModel");

// Import database connection



const connectDB = require("./config/db");
connectDB();

// middlewares for parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  middlewares for static files
app.set("viwe-engine" ,"ejs")
app.use(express.static('public'));

// Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})