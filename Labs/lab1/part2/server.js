const http = require("http");
const fs = require("fs");
const path = require("path");

//function to read page
const readpage = (req, res, filename) => {
  fs.readFile(path.join(__dirname, "pages", filename), "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.end("ERROR LOADING PAGE");
    } else {
      console.log(data);
      res.write(data);
      res.end();
    }
  });
};

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    readpage(req, res, "home.html");
  } else if (req.url === "/about") {
    readpage(req, res, "about.html");
  } else if (req.url === "/contact") {
    readpage(req, res, "contact.html");
  } else if (req.url === "/login") {
    readpage(req, res, "login.html");
  } else {
    readpage(req, res, "404.html");
  }
});

const PORT = 8000;
server.listen(PORT, () => [console.log(`http://localhost:${PORT}`)]);
