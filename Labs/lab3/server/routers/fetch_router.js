const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const upload_directory = path.join(__dirname, "../uploads");
const _ = require("lodash");

router.get("/single", (req, res) => {
  // we read the directory items synchronously to not trip the async speed
  let files_array = fs.readdirSync(upload_directory);
  // error checking
  if (files_array.length == 0) {
    // adding return will stop the rest of the operations
    return res.status(503).send({
      message: "No images",
    });
  }
  let filename = _.sample(files_array);
  res.sendFile(path.join(upload_directory, filename));
});

router.get("/multiple", (req, res) => {
  let files_array = fs.readdirSync(upload_directory);

  if (files_array.length === 0) {
    return res.status(503).send({
      message: "No images",
    });
  }

  let filenames = _.sampleSize(files_array, 3);

  const fileData = filenames.map((filename) => {
    const filePath = path.join(upload_directory, filename);
    const fileBuffer = fs.readFileSync(filePath);
    const base64Data = fileBuffer.toString("base64");

    return {
      filename,
      data: base64Data, // Base64-encoded file data
    };
  });
  // Send the array of Base64-encoded files
  res.json({
    files: fileData,
  });
});

// We have not covered static reads as of yet so we cannot use this
// router.get("/multiple", (req, res) => {
//   // we read the directory items synchronously to not trip the async speed
//   let files_array = fs.readdirSync(upload_directory);
//   // error checking
//   if (files_array.length == 0) {
//     // adding return will stop the rest of the operations
//     return res.status(503).send({
//       message: "No images",
//     });
//   }
//   let filenames = _.sampleSize(files_array, 3);
//   let file_paths = filenames.map((filename) =>
//     path.join(upload_directory, filename)
//   );
//   console.log(file_paths)

//   // Send the array of file paths
//   res.json({
//     files: file_paths,
//   });
// });

module.exports = router;
