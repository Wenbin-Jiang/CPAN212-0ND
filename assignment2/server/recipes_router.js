// recipes_router.js
const express = require("express");
const router = express.Router();
const Recipe = require("./models/recipe");

// GET all recipes
router.get("/", async (req, res) => {
  try {
    recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipes" });
  }
});

// POST a new recipe
router.post("/", async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(500).json({ message: "Error creating recipe" });
  }
});

// GET a recipe by ID
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (recipe) res.status(200).json(recipe);
    else res.status(404).json({ message: "Recipe not found" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipe" });
  }
});

// PUT update a recipe by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedRecipe) res.status(200).json(updatedRecipe);
    else res.status(404).json({ message: "Recipe not found" });
  } catch (error) {
    res.status(500).json({ message: "Error updating recipe" });
  }
});

// DELETE a recipe by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (deletedRecipe) res.status(200).json({ message: "Recipe deleted" });
    else res.status(404).json({ message: "Recipe not found" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting recipe" });
  }
});

module.exports = router;
