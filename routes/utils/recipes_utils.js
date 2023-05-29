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
    })
}

async function getRecipeInstructions(recipes_id, breakdown){
    return await axios.get(`${api_domain}/${recipes_id}/analyzedInstructions`, {
        params: {
            apiKey: process.env.api_token,
            id: recipes_id,
            stepBreakdown: breakdown,
        }
    })
}

async function getSearchInformation(params){
    return await axios.get(`${api_domain}/complexSearch`, {
        params: {
            apiKey: process.env.api_token,
            query: params.query,
            number:params.number,
            cuisine: params.cuisine,
            diet: params.diet,
            intolerances: params.intolerances
        }
    })
}

async function getRecipesSearch(params){
    const response = await getSearchInformation(params);
    const results = response.data.results;
    const results_extended = await getRecipeInformationBulk(Array.from(results, x => x.id));
    return Array.from(results_extended.data, recipe => getRecipeDetailsExtended(recipe));
}

async function getRecipeById(recipe_id) {
    let recipe_info = await getRecipeDetails(recipe_id);
    return getRecipePreview(recipe_info.data);
}

function getRecipePreview(recipe_info){
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
    }
}


async function getRecipeDetailsExtended(recipe_id){
    const recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, extendedIngredients, spoonacularScore } = recipe_info.data;
    const recipe_instructions = await getRecipeInstructions(recipe_id, false);
    let steps = recipe_instructions.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        extendedIngredients: extendedIngredients,
        insteructions: steps,
        popularity: spoonacularScore,
    }
}

// More data pre-proccesing is required to be added
// sending the whole data about the random recipes, maybe the template in getRecipeDetails more suited


exports.getRandomInformation = getRandomInformation;
exports.getRecipeDetails = getRecipeById;
exports.getRecipesSearch = getRecipesSearch;
exports.getRecipeDetailsExtended = getRecipeDetailsExtended;
