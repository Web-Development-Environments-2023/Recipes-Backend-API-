-- Active: 1685369470042@@127.0.0.1@3306@recipesdb
SELECT * FROM users;

SELECT * FROM FavoriteRecipes;

SELECT * FROM SearchHistory;

SELECT * FROM searchhistory WHERE user_id='admin';
SELECT * FROM favoriterecipes;
-- Active: 1685369470042@@127.0.0.1@3306@recipesdb
CREATE TABLE users (
    user_id VARCHAR(8) NOT NULL,
    firstname VARCHAR(128) NOT NULL, 
    lastname VARCHAR(128) NOT NULL,
    country VARCHAR(128) NOT NULL,
    pwd VARCHAR(255) NOT NULL ,
    email VARCHAR(255) NOT NULL,
    profilePic VARCHAR(255) NOT NULL,

    PRIMARY KEY(user_id)

);

CREATE TABLE recipes (
    user_id VARCHAR(8) NOT NULL,
    recipe_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    readyInMinutes DECIMAL NOT NULL,
    img VARCHAR(255) ,
    popularity DECIMAL NOT NULL,
    vegan BOOLEAN NOT NULL,
    vegetarian BOOLEAN NOT NULL,
    glutenFree BOOLEAN NOT NULL,
    extendedIngredients TEXT NOT NULL,
    insteructions TEXT NOT NULL,

    Foreign Key (user_id) REFERENCES users(user_id),
    PRIMARY KEY(user_id, recipe_id)
);
/* 2023-05-30 01:19:08 [64 ms] */ 
CREATE TABLE session (
    user_id VARCHAR(8) NOT NULL,
    session_cookie TEXT,
    session_time TIMESTAMP,

    Foreign Key (user_id) REFERENCES users(user_id),
    PRIMARY KEY (user_id)
);
/* 2023-05-30 01:19:49 [59 ms] */ 
CREATE TABLE FavoriteRecipes (
    user_id  VARCHAR(8) NOT NULL,
    recipe_id INT NOT NULL,
    Foreign Key (user_id) REFERENCES users(user_id),
    PRIMARY KEY (user_id, recipe_id)
);
/* 2023-05-30 01:20:07 [55 ms] */ 


create TABLE WatchedRecipes (
    user_id VARCHAR(8) NOT NULL,
    recipe_id INTEGER NOT NULL,
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    Foreign Key (user_id) REFERENCES users(user_id),
    PRIMARY KEY (user_id, recipe_id)
);

create TABLE SearchHistory (
    user_id VARCHAR(8) NOT NULL,
    search_params VARCHAR(255),
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    Foreign Key (user_id) REFERENCES users(user_id),
    PRIMARY KEY (user_id)
);

INSERT INTO searchhistory values('admin', 'pepper');

DROP TABLE favoriterecipes;
DROP TABLE WatchedRecipes;
DROP TABLE SearchHistory;
DROP TABLE session;
DROP TABLE recipes;
DROP TABLE users;