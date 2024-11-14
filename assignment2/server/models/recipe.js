const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Recipe schema
const recipeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  steps: {
    type: [String],
    required: true,
  },
});

const Recipe = mongoose.model("recipe", recipeSchema);

module.exports = Recipe;
