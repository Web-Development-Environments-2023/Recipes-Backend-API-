const axios = require("axios");
const { param } = require("../user");
const api_domain = "https://api.spoonacular.com/recipes";


/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */

// Spooncular request, using axios, get single recipe full information
async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.api_token
        }
    }).catch((error) => {
        throw {status: error.response.status, message: error.response.statusText};
    });
}
  

// Spooncular request, using axios, get array of random recipes
async function getRandomInformation(number){
    return axios.get(`${api_domain}/random`, {
        params: {
            apiKey: process.env.api_token,
            number: number,
        }
    }).catch((error) => {
        throw {status: error.response.status, message: error.response.statusText};
    });

}

// Spooncular request, using axios, get array of recipes.
async function getRecipeInformationBulk(recipes_ids){
    return await axios.get(`${api_domain}/informationBulk`, {
        params: {
            apiKey: process.env.api_token,
            ids: recipes_ids.toString(),
        }
    }).catch((error) => {
        throw {status: error.response.status, message: error.response.statusText};
    });
}

// Spooncular request, with given recipe_id, return the coorspanding insteructions
async function getRecipeInstructions(recipes_id, breakdown){
    return await axios.get(`${api_domain}/${recipes_id}/analyzedInstructions`, {
        params: {
            apiKey: process.env.api_token,
            id: recipes_id,
            stepBreakdown: breakdown,
        }
    }).catch((error) => {
        throw {status: error.response.status, message: error.response.statusText};
    });
}

// Spooncular request, using the search feature, return array of recipes.
async function getSearchInformation(params){
    return await axios.get(`${api_domain}/complexSearch`, {
        params: {
            apiKey: process.env.api_token,
            query: params.query,
            number:params.number,
            cuisine: params.cuisine,
            diet: params.diet,
            intolerances: params.intolerances,
            instructionsRequired: true,
            addRecipeInformation: true,
            fillIngredients: true
        }
    });
}

// Async function, to get recipe search results, and return only the valueable data of spooncular response.
async function getRecipesSearch(params){
    const response = await getSearchInformation(params);
    const results = response.data.results;
    return results;
}

// Extract the relevant details for recipe preview.
function getRecipePreview(recipe_info){
    let { id, title, readyInMinutes, image, likes, vegan, vegetarian, glutenFree, summary} = recipe_info;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: likes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        summary: summary
    }
}

// Extract the relevant details, of many recipes, with given array recipe_ids, return array of recipes preview.
async function getRecipesPreview(recipes_ids_array){
    const recipes_info = await getRecipeInformationBulk(recipes_ids_array);
    return Array.from(recipes_info.data, recipe => getRecipePreview(recipe));
}


// Extract Recipe extended details, including Ingredients and instructions.
function extractRecipeDetailsExtended(recipe_info){
    const {id, extendedIngredients, analyzedInstructions} = recipe_info;

    return {
        id: id,
        Preview: getRecipePreview(recipe_info),
        extendedIngredients: extendedIngredients,
        Instructions: analyzedInstructions,
    }
}

// Full process handled in order to get extended recipe information.
async function getRecipeExtended(recipe_id){
    const recipe_info = await getRecipeInformation(recipe_id);
    const recipe_instructions = await getRecipeInstructions(recipe_id, false);
    return extractRecipeDetailsExtended(recipe_info, recipe_instructions)
}

// Get the extended information, for given recipe_id array.
async function getRecipesExtended(recipes_id_array){
    let promises = [];
    recipes_id_array.map((recipe_id) => {
        promises.push(getRecipeExtended(recipe_id));
    });
    let info_res = await Promise.all(promises);
    return info_res;
}

// More data pre-proccesing is required to be added
// sending the whole data about the random recipes, maybe the template in getRecipeDetails more suited


exports.getRandomInformation = getRandomInformation;
exports.getRecipeDetails = getRecipeInformation;
exports.getRecipesSearch = getRecipesSearch;

exports.getRecipePreview = getRecipePreview;
exports.getRecipesPreview = getRecipesPreview;

exports.getRecipeExtended = getRecipeExtended;
exports.getRecipesExtended = getRecipesExtended;

exports.extendedRecipe = extractRecipeDetailsExtended;