const DButils = require("./DButils");

// Mark recipes, adding to FavoriteRecipes table, user_id, recipe_id are primary keys.
// therefore, only unique (user_id, recipe_id) pairs
async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`INSERT INTO FavoriteRecipes(user_id, recipe_id) values (?, ?)
    ON DUPLICATE KEY UPDATE recipe_id=?`, [user_id, recipe_id, recipe_id]);
}

// Get favorites recipes, contains given user_id
async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id=?`, user_id);
    return recipes_id;
}

// Mark recipes, adding to WatchedRecipes table, user_id, recipe_id are primary keys.
async function markAsWatchedRecipes(user_id, recipe_id){
    await DButils.execQuery(`insert into WatchedRecipes (user_id, recipe_id) values (?, ?)
    ON DUPLICATE KEY UPDATE recipe_id=?`, [user_id, recipe_id, recipe_id]);
}

// Get Watched recipes, contains given user_id
// therefore, only unique (user_id, recipe_id) pairs
async function getWatchedRecipes(user_id, amount){
    const recipes_ids = await DButils.execQuery(`SELECT recipe_id from WatchedRecipes
    WHERE user_id=? ORDER BY ts desc`, [user_id]); // LIMIT ${amount}
    return recipes_ids;
}

// Save the search request parameters, user_id is primary
// Therefore, user can have only one stored search history at a time.
async function saveSearchRequest(user_id, search_params){
    await DButils.execQuery(`INSERT INTO SearchHistory ( user_id, search_params)
        VALUES(?, ?)
        ON DUPLICATE KEY UPDATE search_params = ?`,
        [user_id, JSON.stringify(search_params), JSON.stringify(search_params)]);

    // Cheat - database for unknown reason update only on second INSERT
    // await DButils.execQuery(`INSERT INTO SearchHistory ( user_id, search_params)
    //     VALUES('${user_id}', '${JSON.stringify(search_params)}')
    //     ON DUPLICATE KEY UPDATE search_params = '${JSON.stringify(search_params)}'`);
}

// get The search recipe
async function getSearchHistory(user_id){
    return await DButils.execQuery(`SELECT search_params FROM SearchHistory Where user_id=?`, user_id);
}

// Create recipe, and register the given field to the database
// user can get his recipes coorsponding to his recipe_id.
async function createRecipe(user_id, recipe_params){
    const {
    title,
    readyInMinutes,
    image,
    vegan,
    vegetarian,
    glutenFree,
    extendedIngredients,
    insteructions} = recipe_params;

    const recipe_id = await DButils.execQuery(`SELECT COUNT(*) FROM recipes`)
    .then((count) => {
        return Object.values(count[0])[0];
    });

    console.log(recipe_id);
    await DButils.execQuery(`INSERT INTO 
    recipes (user_id, recipe_id, title, readyInMinutes, img, vegan, vegetarian, glutenFree, extendedIngredients, insteructions)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [user_id, recipe_id+1, title, readyInMinutes, image, vegan, vegetarian, glutenFree, extendedIngredients, insteructions]
    )
}

// Get all created recipes by user_id
async function getCreatedRecipes(user_id){
    return await DButils.execQuery(`SELECT * FROM Recipes WHERE user_id = ?`, user_id);
}

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;

exports.markAsWatchedRecipes = markAsWatchedRecipes;
exports.getWatchedRecipes = getWatchedRecipes;

exports.saveSearchRequest = saveSearchRequest;
exports.getSearchHistory = getSearchHistory;

exports.createRecipe = createRecipe;
exports.getCreatedRecipes = getCreatedRecipes;