const express = require('express');
const app = express();
const port = 3000;

// Database connection
const mongoose = require('mongoose');
const User = require("./models/userModel");
const path = require("path");
// Import database connection



const connectDB = require("./config/db");
connectDB();

// middlewares for parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// static folder for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


//  middlewares for static files
// static files and EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
// Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/", userRoutes);

//product routes
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

// Frontend page route
app.get("/", (req, res) => {
  res.render("addProduct");
});

app.use((req, res, next) => {
    res.status(404).render("404.ejs");
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})