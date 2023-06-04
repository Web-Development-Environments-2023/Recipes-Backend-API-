### Development-Backend branch create

#### TODO list
- [ ] API Tests
- [x] Connect the database commands to the webserver.
- [x] Add database log of user actions: 3 last search results, favorite recipes, recentaly watched.
- [x] API update
- [ ] Test project working on bgu server
- [ ] Add more consistency with handling recipes modifications, middlewares may be the solution
- [x] Search request contain the fields -  query number, cuisine, diet, intolerances, https://spoonacular.com/food-api/docs, <b>3.2 page 5 end</b>
  - Returned Object from search id: id,
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
        
  - Add user arguments for '/Register' route, POST command
      username VARCHAR(8) NOT NULL,
      firstname VARCHAR(128) NOT NULL, 
      lastname VARCHAR(128) NOT NULL,
      country VARCHAR(128) NOT NULL,
      pwd VARCHAR(255) NOT NULL ,
      email VARCHAR(255) NOT NULL,
      profilePic VARCHAR(255) NOT NULL,

                                    
Setup of database including env required field for connection
Register and Login working,

## Started
<del>Cookie get and add to user session, how to store and recgonize current user that 
Saving Recipe\Favorites\Recentaly watched.</del>

### Database supported use-cases
1)  As User, I want to like recipes, so that i can access them easily.
2)  As User, I want my clicked recipes kept history, so that i can return to to continue the recipe quickly.  
3)  As User, I want to search recipes with free text and categories, so that i can make my prefered recipe type.

#### TODO
1) As User, i want to add recipes of my own, so i can store tradtional\family recipes.
2) As User, i except the main menu to contain recently watched, favorites recipes, so that i can navigate easily to the most important stuff.
3) 

### Database
recipesdb - info user-root, password-local user password
#### Tables
- users
- recipes
- searchhistory
- watchedrecipes
- favoritesrecipes
  
