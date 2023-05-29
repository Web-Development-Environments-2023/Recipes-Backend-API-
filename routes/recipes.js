var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));


router.get("/random", async (req, res, next) => {
  try {   
    const recipes_random = await recipes_utils.getRandomInformation(req.query.number);
    res.send(recipes_random);
  }catch (error ){
    next(error);
  }
})

router.get("/search", async (req,res, next) => {
  console.log(req.query);
  try{
    const search_results = await recipes_utils.getRecipesSearch({
      query: req.query.query,
      number: req.query.number,
      cuisine: req.query.cuisine,
      diet: req.query.diet,
      intolerances: req.query.intolerances
    });

    res.send(search_results);
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



module.exports = router;
