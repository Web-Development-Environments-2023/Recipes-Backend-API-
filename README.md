### Development-Backend branch create

#### TODO list
- Connect the database commands to the webserver.
- Add database log of user actions: 3 last search results, favorite recipes, recentaly watched.
- API update
- - Search request contain the fields -  query number, cuisine, diet, intolerances, https://spoonacular.com/food-api/docs, <b>3.2 page 5 end</b>
- - Returned Object from search id: id,
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
        
                                      