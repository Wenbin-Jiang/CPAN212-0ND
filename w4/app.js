const PORT = process.env.PORT || 8000;
const { log } = require("console");
const express = require("express");
const app = express();

// middlelware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const logger = (req, res, next) => {
  console.log(req.url);
  console.log(req.method);
  console.log(new Date().toUTCString());
  next();
};

const hello = (req, res, next) => {
  console.log("hello");
  next();
};
//this adds it to every router
app.use(logger);

// routes
app.get("/", logger, (req, res) => {
  res.send("Welcome to our server");
});

// routes
app.get("/about", (req, res) => {
  res.send("Welcome to About");
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

app.use("", (req, res) => {
  res.status(404).send("Page not found");
});
