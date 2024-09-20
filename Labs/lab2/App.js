const express = require("express");
const app = express();
const PORT = 8000;
const lab_router = require("./router");

app.use(express.urlencoded({ extended: true }));

app.use("/lab2", lab_router);

app.get("/", (req, res) => {
  res.send("Hello from the other side");
});

const name = "Wenbin Jiang";
const studentID = "n01645691";

app.get("/name", (req, res) => {
  res.send("Wenbin Jiang");
});

app.get("/greeting", (req, res) => {
  res.send("My name is Wenbin, my student number is n01645691.");
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

app.use("", (req, res) => {
  res.status(404).send("Page not found");
});
