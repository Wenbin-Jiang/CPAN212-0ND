const mongoose = require("mongoose");

// Define the Book Schema
const bookSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
    },
    currentLender: {
      type: String,
      default: null,
    },
    category: {
      type: [String],
      required: true,
    },
    pages: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Create the Book Model based on the schema
const Book = mongoose.model("books", bookSchema);

module.exports = Book;
