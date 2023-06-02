var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");
const recipes = require("./recipes");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    if( recipe_id == null){
      throw {status: 400, message: "Recipe ID to add is missing"}
    }
    await user_utils.markAsFavorite(user_id,recipe_id)
    .catch(error => {
      
    });
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    var favorite_recipes = [];
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    recipes_id.map((element) => favorite_recipes.push(element.recipe_id)); //extracting the recipe ids into array
    if(favorite_recipes.length == 0) {
      res.status(204).send("Yet to add Favorites recipes");
    } else {
      const results = await recipe_utils.getRecipesPreview(favorite_recipes);
      res.status(200).send(results);
    }
  } catch(error){
    next(error); 
  }
});


router.get("/recipes/:recipeId/Information", async (req, res, next) => {
  try
  {
    const user_id = req.session.user_id;
    const recipe_id = req.params.recipeId;
    await user_utils.markAsWatchedRecipes(user_id, recipe_id);
    console.log("Recipe succesfully added to WatchedRecieps database " + recipe_id + "  " + user_id);
    next();
  }
  catch(error) {
    next(error);
  }
})

router.get("/recipes/search", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const search_params = {
      query: req.query.query,
      number: req.query.number,
      cuisine: req.query.cuisine,
      diet: req.query.diet,
      intolerances: req.query.intolerances
    }
    await user_utils.saveSearchRequest(user_id, search_params);
    const search_results = await recipe_utils.getRecipesSearch(search_params);
    res.status(200).send(search_results);
  } catch (error) {
      next(error);
  }
});

router.get("recipes/create", async (req, res, next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_params = {
      id: id,
      title: title,
      readyInMinutes: readyInMinutes,
      image: image,
      vegan: vegan,
      vegetarian: vegetarian,
      glutenFree: glutenFree,
      extendedIngredients: extendedIngredients,
      insteructions: steps,
    }

    const recipe_id = await user_utils.createRecipe(user_id, recipe_params);
    res.status(200).send(recipe_id);
  }catch(error ) {
    next(error);
  }
});

router.use("/recipes", recipes);



module.exports = router;
