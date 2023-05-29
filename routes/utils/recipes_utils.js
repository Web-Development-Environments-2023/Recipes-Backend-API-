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
    const results = await getSearchInformation(params);
    console.log(results);
}

async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    console.log(recipe_info);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

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


// More data pre-proccesing is required to be added
// sending the whole data about the random recipes, maybe the template in getRecipeDetails more suited


exports.getRandomInformation = getRandomInformation;
exports.getRecipeDetails = getRecipeDetails;
exports.getRecipesSearch = getRecipesSearch;

