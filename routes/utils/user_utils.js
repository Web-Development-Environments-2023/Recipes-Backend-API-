const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`INSERT INTO FavoriteRecipes(user_id, recipe_id) values ('${user_id}',${recipe_id})
    ON DUPLICATE KEY UPDATE user_id=${user_id}`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}

async function markAsWatchedRecipes(user_id, recipe_id){
    await DButils.execQuery(`insert into WatchedRecipes (user_id, recipe_id) values ('${user_id}', ${recipe_id})
    ON DUPLICATE KEY UPDATE user_id=${user_id}`);
}

async function getWatchedRecipes(user_id, amount){
    const recipes_ids = await DButils.execQuery(`SELECT recipe_id from WatchedRecipes
    WHERE user_id=${user_id} ORDER BY timestamp desc
    LIMIT ${amount}`);
    return recipes_ids;
}

async function saveSearchRequest(user_id, search_params){
    await DButils.execQuery(`INSERT INTO SearchHistory ( user_id, search_params)
        VALUES('${user_id}', '${JSON.stringify(search_params)}')
        ON DUPLICATE KEY UPDATE search_params = '${JSON.stringify(search_params)}'`);

    // Cheat - database for unknown reason update only on second INSERT
    // await DButils.execQuery(`INSERT INTO SearchHistory ( user_id, search_params)
    //     VALUES('${user_id}', '${JSON.stringify(search_params)}')
    //     ON DUPLICATE KEY UPDATE search_params = '${JSON.stringify(search_params)}'`);
}

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markAsWatchedRecipes = markAsWatchedRecipes;
exports.getWatchedRecipes = getWatchedRecipes;
exports.saveSearchRequest = saveSearchRequest;