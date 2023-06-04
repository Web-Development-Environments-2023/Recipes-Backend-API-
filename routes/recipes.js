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
    const {query, number, cuisine, diet, intolerances} = req.query;
    const search_params = {
      query: query,
      number: number,
      cuisine: cuisine,
      diet: diet,
      intolerances: intolerances
    }

    if(Object.values(search_params).every(param => param === undefined)){
      throw {status: 204, message: 'No Content, search parameters are empty'};
    }
    const search_results = await recipes_utils.extractRecipeDetailsExtended(search_params);
    console.log(search_results);
    
    const recipes = Array.from(search_results, recipe => recipes_utils.extendedRecipe(recipe));
    res.send(recipes);
  }catch (error) {    

    next(error);
  }
})

/**
 * This path returns a full details of a recipe by its id
 */

router.get("/:recipeId/Information", async(req, res, next) => {
  try {
    const recipeId = req.params.recipeId;
    if(!req.params){
      throw {status: 400, message: "Missing, No params passed with request"};
    }
    if(!recipeId || recipeId === ""){
      throw {status: 400, message: "Missing, RecipeId param is empty"};
    }
    if(recipeId.match(/^[0-9]+$/) == null){
      throw {status: 400, message: "Invalid, Recipe id most be a number"};
    }
    const recipe_info = await recipes_utils.getRecipeDetails(recipeId)
    .then((result) => {
      const recipe = result.data;
      if(recipe === undefined){
        throw {status: 204, message: 'No Content, search parameters are empty'};
      }

      const recipe_extended = recipes_utils.extendedRecipe(recipe);
      // console.log(recipe_extended);
      return recipe_extended;
    });

    res.send(recipe_info);
  } catch (error){
    next(error);
  }
})

module.exports = router;
