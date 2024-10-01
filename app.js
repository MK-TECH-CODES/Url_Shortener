const express = require("express");
require("dotenv").config();
const path = require("path");

//Middleware
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // For the json
app.use(express.urlencoded({ extended: true })); // Urlencoded data

// Routes Pages
const Home_route = require("./routes/home_route");
const url_short = require("./routes/url_shorten");

// URL short Route
app.use("/urlshort/", url_short);
// Home route
app.use("/", Home_route);

//Shortener Url Page
// app.use("/:id([a-zA-Z0-9]{6})", Home_route);

app.listen(process.env.PORT, () => {
  console.log(`server is running in ${process.env.PORT}`);
});
