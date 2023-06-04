var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));

200
router.get("/random", async (req, res, next) => {
  try {   
    const recipes_random = await recipes_utils.getRandomInformation(req.query.number);
    const recipes_preview = Array.from(recipes_random, recipe => recipes_utils.getRecipePreview(recipe));
    res.send(recipes_preview);
  }catch (error ){
    next(error);
  }
})

router.get("/search", async (req,res, next) => {
  try{
    const search_results = await recipes_utils.getRecipesSearch({
      query: req.query.query,
      number: req.query.number,
      cuisine: req.query.cuisine,
      diet: req.query.diet,
      intolerances: req.query.intolerances
    });
    
    const recipes = Array.from(search_results, recipe => recipes_utils.extendedRecipe(recipe));
    res.send(recipes);
  }catch (error) {    

    next(error);
  }
})

/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

router.get("/:recipeId/Information", async(req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetailsExtended(req.params.recipeId);
    res.send(recipe);
  } catch (error){
    next(error);
  }
})

module.exports = router;
