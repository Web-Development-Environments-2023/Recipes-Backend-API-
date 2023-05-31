const DButils = require("./DButils");

async function markAsFavorite(username, recipe_id){
    await DButils.execQuery(`insert into WatchedRecieps values ('${username}',${recipe_id})`);
}

async function getFavoriteRecipes(username){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${username}'`);
    return recipes_id;
}

async function markAsWatchedRecipes(username, recipe_id){
    await DButils.execQuery(`insert into WatchedRecipes (user_id, recipe_id) values ('${username}', ${recipe_id})`);
}

async function getWatchedRecipes(username, amount){
    const recipes_ids = await DButils.execQuery(`SELECT recipe_id from WatchedRecipes
    WHERE username=${username} ORDER BY timestamp desc
    LIMIT ${amount}`);
    return recipes_ids;
}

async function saveSearchRequest(username, search_params){
    await DButils.execQuery(`INSERT INTO SearchHistory (user_id, search_params) 
    values ('${username}', '${JSON.stringify(search_params)}')
    ON DUPLICATE KEY UPDATE search_params='${JSON.stringify(search_params)}';`);
}

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markAsWatchedRecipes = markAsWatchedRecipes;
exports.getWatchedRecipes = getWatchedRecipes;
exports.saveSearchRequest = saveSearchRequest;