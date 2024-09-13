const fs = require("fs");
const path = require("path");

// const mypath = path.join(__dirname, "pages", "home.html");
// console.log(mypath);

//read file
// const file = path.join(__dirname, "example.txt");
// fs.readFile(file, "utf-8", (err, data) => {
//   if (err) throw err;
//   console.log(data);
// });

//read directory
fs.readdir(path.join(__dirname, "pages"), "utf-8", (err, data) => {
  if (err) throw err;
  console.log("file array", data);

  data.forEach((item) => {
    console.log("file names", item);
    fs.readFile(path.join(__dirname, "pages", item), "utf-8", (err, data) => {
      if (err) throw err;
      console.log("file content" + "\n" + data);
    });
  });
});
