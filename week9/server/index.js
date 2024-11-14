require("dotenv").config();
const PORT = process.env.PORT || 9000;
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

// adding our mongoDB database
const mongoose = require("mongoose"); // importing the dependancy
mongoose.connect(process.env.MONGODB_KEY); // establishing a connection -> connect command + an api string to connect to our database
// this does not keep the connection, only establishes where it will go to connect
const db = mongoose.connection; // saving the databse usecase into a variable

db.once("open", () => {
  // Check connection
  console.log("Connected to MongoDB");
});

db.on("error", (err) => {
  // Check for DB errors
  console.log("DB Error");
});

// middlelware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes
const Book = require("./models/book");
app.get("/book/fetch-all", (req, res) => {
  console.log(req.query);
  let filter = {};

  if (req.query.title) {
    filter.title = req.query.title;
  }

  Book.find(filter)
    .then((books) => res.json(books))
    .catch((err) => res.send(err));
});

app.get("/", (req, res) => {
  res.send("Welcome to our server");
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

app.use("", (req, res) => {
  res.status(404).send("Page not found");
});
