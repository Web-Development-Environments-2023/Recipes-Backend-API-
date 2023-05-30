### Development-Backend branch create

#### TODO list
- [] Connect the database commands to the webserver.
- [] Add database log of user actions: 3 last search results, favorite recipes, recentaly watched.
- [] API update
- - Search request contain the fields -  query number, cuisine, diet, intolerances, https://spoonacular.com/food-api/docs, <b>3.2 page 5 end</b>
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
TOCOMPLETE
How to recive and send cookie with provided code at main.js

### Tables
- users
- session
- favorite
- recipes
- 
