const axios = require("axios");
const { param } = require("../user");
const api_domain = "https://api.spoonacular.com/recipes";


/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    try {
            return await axios.get(`${api_domain}/${recipe_id}/information`, {
            params: {
                includeNutrition: false,
                apiKey: process.env.api_token
            }
        });
    }  catch(error){
         throw { status: error.response.data.code, message: error.response.data.message};
    };
}
  


async function getRandomInformation(number){
    try{
        return axios.get(`${api_domain}/random`, {
            params: {
                apiKey: process.env.api_token,
                number: number,
            }
        });
    } catch(error){
        throw { status: error.response.data.code, message: error.response.data.message};
    };
}

async function getRecipeInformationBulk(recipes_ids){
    try{
        return await axios.get(`${api_domain}/informationBulk`, {
            params: {
                apiKey: process.env.api_token,
                ids: recipes_ids.toString(),
            }
        });
    }catch(error){
        throw { status: error.response.data.code, message: error.response.data.message};
    }
}

async function getRecipeInstructions(recipes_id, breakdown){
    try{
        return await axios.get(`${api_domain}/${recipes_id}/analyzedInstructions`, {
            params: {
                apiKey: process.env.api_token,
                id: recipes_id,
                stepBreakdown: breakdown,
            }
        });
    }catch(error){
        throw { status: error.response.data.code, message: error.response.data.message};
    }
}

async function getSearchInformation(params){
    try{
        return await axios.get(`${api_domain}/complexSearch`, {
            params: {
                apiKey: process.env.api_token,
                query: params.query,
                number:params.number,
                cuisine: params.cuisine,
                diet: params.diet,
                intolerances: params.intolerances
            }
        });
    }catch(error){
        throw { status: error.response.data.code, message: error.response.data.message};
    }
}

async function getRecipesSearch(params){
    const response = await getSearchInformation(params);
    const results = response.data.results;
    return await getRecipeDetailsExtended(Array.from(results, recipe => recipe.id));
    // return Array.from(results_extended.data, recipe => getRecipeDetailsExtended(recipe));
}

async function getRecipeById(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
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

async function getRecipesPreview(recipes_ids_array){
    const recipes_info = await getRecipeInformationBulk(recipes_ids_array);
    return Array.from(recipes_info.data, recipe => getRecipePreview(recipe));
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
exports.getRecipePreview = getRecipePreview;
exports.getRecipesPreview = getRecipesPreview;