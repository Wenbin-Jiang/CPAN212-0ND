const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to lab 2 router file");
});

router.get("/name", (req, res) => {
  res.send("Wenbin Jiang");
});

router.get("/greeting", (req, res) => {
  res.send("My name is Wenbin, my student number is n01645691.");
});

router.get("/add/:x/:y", (req, res) => {
  let x = parseFloat(req.params.x);
  let y = parseFloat(req.params.y);
  res.send(`${x} + ${y} = ${x + y}`);
});

router.get("/calculate/:x/:y/:operation", (req, res) => {
  let x = parseFloat(req.params.x);
  let y = parseFloat(req.params.y);
  let op = req.params.operation;

  switch (op) {
    case "+":
      res.send(JSON.stringify(x + y));
      break;
    case "-":
      res.send(JSON.stringify(x - y));
      break;
    case "*":
      res.send(JSON.stringify(x * y));
      break;
    case "/":
      res.send(JSON.stringify(x / y));
      break;
    case "**":
      res.send(JSON.stringify(x ** y));
      break;
    default:
      res.send("Incorrect operation");
      break;
  }
});

module.exports = router;
