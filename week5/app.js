const PORT = process.env.PORT || 8000;
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");

// adding multer
const multer = require("multer");
const storage = multer.diskStorage({
  // the function that saves the file
  destination: function (req, file, cb) {
    // where we are storing the file
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    // what is the filename going to be
    cb(null, `${Date.now()}-${file.originalname}`); // this will save files like: date-filename.extension
  },
});

const upload = multer({ storage: storage });
// the middleware function that handles uploading
// middlelware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// routes
app.get("/", (req, res) => {
  res.send("Welcome to our server");
});

app.post("/save/single", upload.single("file"), (req, res) => {
  res.send("File uploaded");
});

app.post("/save/multiple", upload.array("files", 100), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files uploaded.");
  }
  const filePaths = req.files.map((file) => file.path);
  res.send(`Files uploaded successfully: ${filePaths.join(", ")}`);
});

app.get("/fetch/single", (req, res) => {
  // we read the directory items synchronously to not trip the async speed
  let files_array = fs.readdirSync(path.join(__dirname, "uploads"));
  // error checking
  if (files_array.length == 0) {
    // adding return will stop the rest of the operations
    return res.status(503).send({
      message: "No images",
    });
  }
  let filename = _.sample(files_array);
  res.sendFile(path.join(__dirname, "uploads", filename));
});

app.get("/fetch/multiple", (req, res) => {
  const files_array = fs.readdirSync(path.join(__dirname, "uploads"));
  console.log(files_array);
  if (files_array.length == 0) {
    return res.send("No files found");
  }
  let random_filename = _.sampleSize(files_array, 3);
  res.json({ data: random_filename });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

app.use("", (req, res) => {
  res.status(404).send("Page not found");
});
