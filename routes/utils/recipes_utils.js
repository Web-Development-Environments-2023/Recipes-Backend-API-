const axios = require("axios");
const { param } = require("../user");
const api_domain = "https://api.spoonacular.com/recipes";


/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


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
  


async function getRandomInformation(number){
    return axios.get(`${api_domain}/random`, {
        params: {
            apiKey: process.env.api_token,
            number: number,
        }
    });

}

async function getRecipeInformationBulk(recipes_ids){
    return await axios.get(`${api_domain}/informationBulk`, {
        params: {
            apiKey: process.env.api_token,
            ids: recipes_ids.toString(),
        }
    });
}

async function getRecipeInstructions(recipes_id, breakdown){
    return await axios.get(`${api_domain}/${recipes_id}/analyzedInstructions`, {
        params: {
            apiKey: process.env.api_token,
            id: recipes_id,
            stepBreakdown: breakdown,
        }
    });
}

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

async function getRecipesSearch(params){
    const response = await getSearchInformation(params);
    const results = response.data.results;
    return results;
}


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

async function getRecipesPreview(recipes_ids_array){
    const recipes_info = await getRecipeInformationBulk(recipes_ids_array);
    return Array.from(recipes_info.data, recipe => getRecipePreview(recipe));
}

function extractRecipeDetailsExtended(recipe_info){
    const {id, extendedIngredients, analyzedInstructions} = recipe_info;

    return {
        id: id,
        Preview: getRecipePreview(recipe_info),
        extendedIngredients: extendedIngredients,
        Instructions: analyzedInstructions,
    }
}

async function getRecipeExtended(recipe_id){
    const recipe_info = await getRecipeInformation(recipe_id);
    const recipe_instructions = await getRecipeInstructions(recipe_id, false);
    return extractRecipeDetailsExtended(recipe_info, recipe_instructions)
}

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