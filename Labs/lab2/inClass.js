const express = require("express");
const app = express();
const PORT = 8000;
const path = require("path");

//adding middleware
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log(req.url);
  console.log(req.method);
  console.log(req.params);
  console.log(req.query);
  console.log(req.body);
  res.sendFile(path.join(__dirname, "pages", "home.html"));
});

const name = "Wenbin Jiang";
const studentID = "n01645691";

app.get("/name", (req, res) => {
  res.send(`${name}`);
});

app.get("/greeting", (req, res) => {
  res.send(`Name: ${name}, Student ID: ${studentID}`);
});

app.get("/add/x:x/y:y", (req, res) => {
  res.send(`${x + y}`);
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "about.html"));
});
app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "contact.html"));
});

app.post("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "login.html"));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "pages", "404.html"));
});
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
