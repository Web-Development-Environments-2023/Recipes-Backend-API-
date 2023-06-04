var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");
const recipes = require("./recipes");


function modifyResponseBody(req, res, next) {
  const user_id = req.user_id;
  // Store the original send method
  const _send = res.send;
  // Override it
  res.send = async function (recipes) {
    const favorites = await user_utils.getFavoriteRecipes(user_id, 'NULL').then((recipes) => {
      console.log('favorites search complete');
      return recipes;
    }).catch((error) =>{
      console.error(`Could not get favorites: ${error}`)
    });
    const watched = await user_utils.getWatchedRecipes(user_id, 'NULL').then((recipes) => {
      console.log('watched search complete');
      return recipes;
    }).catch((error) => {
      console.error(`Could not get Recentaly watched: ${error}` );
    });
    recipes.forEach(recipe => {      
      recipe.userData
       = {
        favorite: false,
        watched: false
      }
      
      if (favorites.find(fav => fav.recipe_id === recipe.id)) {
        recipe.user.favorite = true;
      }
      
      if (watched.find(wat => wat.recipe_id === recipe.id)) {
        recipe.user.watched = true;
      }
      
    })
    
    // Reset it
    res.send = _send;
    // Actually send the response
    res.send(recipes);
  }
  next();
}

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

router.use((req, res, next) => {
  // console.log('here', req.method, req.path);
  if(req.method === 'POST'){
    next();
  }
  modifyResponseBody(req, res, next);
})

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
    next();
  } catch (error) {
      next(error);
  }
});


router.post("recipes/create", async (req, res, next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_params = {
      id: req.body.id,
      title: req.body.title,
      readyInMinutes: req.body.readyInMinutes,
      image: req.body.image,
      vegan: req.body.vegan,
      vegetarian: req.body.vegetarian,
      glutenFree: req.body.glutenFree,
      extendedIngredients: req.body.extendedIngredients,
      Instructions: req.body.steps,
    }

    const recipe_id = await user_utils.createRecipe(user_id, recipe_params);
    res.status(200).send(recipe_id);
  }catch(error ) {
    next(error);
  }
});


router.use("/recipes", recipes);

module.exports = router;

// pass boo
