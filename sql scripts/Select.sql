SELECT * FROM users;


-- Active: 1685369470042@@127.0.0.1@3306@recipesdb
CREATE TABLE users (
    username VARCHAR(8) NOT NULL,
    firstname VARCHAR(128) NOT NULL, 
    lastname VARCHAR(128) NOT NULL,
    country VARCHAR(128) NOT NULL,
    pwd VARCHAR(255) NOT NULL ,
    email VARCHAR(255) NOT NULL,
    profilePic VARCHAR(255) NOT NULL,

    PRIMARY KEY(username)
);


INSERT INTO users(username, firstname, lastname, country, pwd, email, profilePic)
VALUES ('admin', 'admin','admin','admin','admin', 'admin@example.test', '🐞')
;

INSERT INTO users VALUES ('adminTwo', 'admin2', 'admin2', 'admin2', '$2b$13$wm/G1kx/aFItyqgzpoHVveVL1lxXROhWICJIAh7Y67TfXLzeuWT5e', 'admin2@example.test' , '🐇');

CREATE TABLE recipes (
    username VARCHAR(8) NOT NULL,
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

    Foreign Key (username) REFERENCES users(username)
);
/* 2023-05-30 01:19:08 [64 ms] */ 
CREATE TABLE session (
    username VARCHAR(8),
    session_cookie TEXT,
    session_time TIMESTAMP,

    Foreign Key (username) REFERENCES users(username)
);
/* 2023-05-30 01:19:49 [59 ms] */ 
CREATE TABLE favorite (
    username  VARCHAR(8),
    recipe_id INT NOT NULL,
    Foreign Key (username) REFERENCES users(username)
);
/* 2023-05-30 01:20:07 [55 ms] */ 
CREATE TABLE session (
    username VARCHAR(8),
    session_cookie TEXT NOT NULL,
    session_time TIMESTAMP NOT NULL,

    Foreign Key (username) REFERENCES users(username)
);